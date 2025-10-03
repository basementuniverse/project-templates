import { vec2 } from '@basementuniverse/vec';
import Expo2DContext from 'expo-2d-context';

export type DebugOptions = {
  /**
   * Edge of screen margin
   */
  margin: number;

  /**
   * Space between debug text and background
   */
  padding: number;

  /**
   * The font to use when rendering debug text
   */
  font: string;

  /**
   * Line height of debug text
   */
  lineHeight: number;

  /**
   * Margin between each line of debug text
   */
  lineMargin: number;

  /**
   * Foreground colour of debug text
   */
  foregroundColour: string;

  /**
   * Background colour of debug text
   */
  backgroundColour: string;

  /**
   * Default debug value options
   */
  defaultValue: DebugValue;

  /**
   * Default debug chart options
   */
  defaultChart: DebugChart;

  /**
   * Default debug marker options
   */
  defaultMarker: DebugMarker;

  /**
   * Default debug border options
   */
  defaultBorder: DebugBorder;
};

export type DebugValue = {
  label?: string;
  value?: number | string;
  align: 'left' | 'right';
  showLabel: boolean;
  padding?: number;
  font?: string;
  foregroundColour?: string;
  backgroundColour?: string;
  level?: number;
};

export type DebugChart = {
  label?: string;
  values: number[];
  valueBufferSize: number;
  valueBufferStride: number;
  minValue: number;
  maxValue: number;
  barWidth: number;
  barColours?: {
    offset: number;
    colour: string;
  }[];
  align: 'left' | 'right';
  showLabel: boolean;
  padding?: number;
  font?: string;
  foregroundColour?: string;
  backgroundColour?: string;
  chartBackgroundColour?: string;
  level?: number;
};

export type DebugMarker = {
  label?: string;
  value?: number | string;
  position?: vec2;
  showLabel: boolean;
  showValue: boolean;
  showMarker: boolean;
  markerSize: number;
  markerStyle: 'x' | '+' | '.';
  markerColour: string;
  space: 'world' | 'screen';
  padding?: number;
  font?: string;
  labelOffset: vec2;
  foregroundColour?: string;
  backgroundColour?: string;
  level?: number;
};

export type DebugBorder = {
  label?: string;
  value?: number | string;
  position?: vec2;
  size?: vec2;
  radius?: number;
  showLabel: boolean;
  showValue: boolean;
  showBorder: boolean;
  borderWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderShape: 'rectangle' | 'circle';
  borderColour: string;
  borderDashSize: number;
  space: 'world' | 'screen';
  padding?: number;
  font?: string;
  labelOffset: vec2;
  foregroundColour?: string;
  backgroundColour?: string;
  level?: number;
};

export default class Debug {
  private static instance: Debug;

  private static readonly defaultOptions: DebugOptions = {
    margin: 20,
    padding: 10,
    font: '40px monospace',
    lineHeight: 30,
    lineMargin: 0,
    foregroundColour: '#fff',
    backgroundColour: '#333',
    defaultValue: {
      align: 'left',
      showLabel: true,
    },
    defaultChart: {
      values: [],
      valueBufferSize: 60,
      valueBufferStride: 1,
      minValue: 0,
      maxValue: 100,
      barWidth: 2,
      align: 'left',
      showLabel: true,
      chartBackgroundColour: '#222',
    },
    defaultMarker: {
      showLabel: true,
      showValue: true,
      showMarker: true,
      markerSize: 6,
      markerStyle: 'x',
      markerColour: '#ccc',
      space: 'world',
      labelOffset: vec2(10),
    },
    defaultBorder: {
      showLabel: true,
      showValue: true,
      showBorder: true,
      borderWidth: 1,
      borderStyle: 'solid',
      borderShape: 'rectangle',
      borderColour: '#ccc',
      borderDashSize: 5,
      space: 'world',
      labelOffset: vec2(10),
    },
  };

  private options: DebugOptions;

  private values: Map<string, DebugValue>;

  private charts: Map<string, DebugChart>;

  private markers: Map<string, DebugMarker>;

  private borders: Map<string, DebugBorder>;

  private constructor(options?: Partial<DebugOptions>) {
    if (options?.defaultValue) {
      options.defaultValue = Object.assign(
        {},
        Debug.defaultOptions.defaultValue,
        options.defaultValue
      );
    }
    if (options?.defaultChart) {
      options.defaultChart = Object.assign(
        {},
        Debug.defaultOptions.defaultChart,
        options.defaultChart
      );
    }
    if (options?.defaultMarker) {
      options.defaultMarker = Object.assign(
        {},
        Debug.defaultOptions.defaultMarker,
        options.defaultMarker
      );
    }
    if (options?.defaultBorder) {
      options.defaultBorder = Object.assign(
        {},
        Debug.defaultOptions.defaultBorder,
        options.defaultBorder
      );
    }
    this.options = Object.assign({}, Debug.defaultOptions, options ?? {});
    this.values = new Map<string, DebugValue>();
    this.charts = new Map<string, DebugChart>();
    this.markers = new Map<string, DebugMarker>();
    this.borders = new Map<string, DebugBorder>();
  }

  /**
   * Initialise the debug renderer for displaying values and markers
   */
  public static initialise(options: Partial<DebugOptions> = {}) {
    Debug.instance = new Debug(options);
  }

  private static getInstance(): Debug {
    if (Debug.instance === undefined) {
      throw new Error('Debug not properly initialised');
    }

    return Debug.instance;
  }

  /**
   * Show a debug value
   */
  public static value(
    label: string,
    value: string | number,
    options?: Partial<DebugValue>
  ) {
    const instance = Debug.getInstance();

    instance.values.set(
      label,
      Object.assign(
        {},
        instance.options.defaultValue,
        instance.values.get(label) ?? {},
        options ?? {},
        { label, value }
      )
    );
  }

  /**
   * Show a debug chart
   */
  public static chart(
    label: string,
    value: number,
    options?: Partial<DebugChart>
  ) {
    const instance = Debug.getInstance();
    const currentChart = instance.charts.get(label);

    instance.charts.set(
      label,
      Object.assign(
        {},
        instance.options.defaultChart,
        currentChart ?? {},
        options ?? {},
        {
          label,
          values: [...(currentChart?.values ?? []), value].slice(
            -(
              options?.valueBufferSize ??
              instance.options.defaultChart.valueBufferSize
            )
          ),
        }
      )
    );
  }

  /**
   * Remove a debug chart
   */
  public static removeChart(label: string) {
    const instance = Debug.getInstance();

    instance.charts.delete(label);
  }

  /**
   * Show a marker in world or screen space
   */
  public static marker(
    label: string,
    value: string | number,
    position: vec2,
    options?: Partial<DebugMarker>
  ) {
    const instance = Debug.getInstance();

    instance.markers.set(
      label,
      Object.assign(
        {},
        instance.options.defaultMarker,
        instance.markers.get(label) ?? {},
        options ?? {},
        { label, value, position }
      )
    );
  }

  /**
   * Show a border in world or screen space
   */
  public static border(
    label: string,
    value: string | number,
    position: vec2,
    options?: Partial<DebugBorder>
  ) {
    if (options?.borderShape === 'circle' && options?.radius === undefined) {
      // Don't add the border if it's circular but we don't have a radius
      return;
    }

    if (options?.borderShape !== 'circle' && options?.size === undefined) {
      // Don't add the border if it's rectangular (default is rectangular) but
      // we don't have a size
      return;
    }

    const instance = Debug.getInstance();

    instance.borders.set(
      label,
      Object.assign(
        {},
        instance.options.defaultBorder,
        instance.borders.get(label) ?? {},
        options ?? {},
        { label, value, position }
      )
    );
  }

  /**
   * Render the debug values and markers onto a canvas
   */
  public static draw(context: Expo2DContext, screen: vec2, level: number = 0) {
    const instance = Debug.getInstance();

    // Draw world-space markers & borders
    context.save();
    instance.markers.forEach(marker => {
      if (marker.level !== undefined && marker.level < level) {
        return;
      }

      if (marker.space === 'world') {
        instance.drawMarker(context, screen, marker);
      }
    });
    instance.borders.forEach(border => {
      if (border.level !== undefined && border.level < level) {
        return;
      }

      if (border.space === 'world') {
        instance.drawBorder(context, screen, border);
      }
    });
    context.restore();

    // Draw values, charts and screen-space markers & borders
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);

    let position: vec2;
    let leftY = instance.options.margin;
    let rightY = instance.options.margin;

    const lineHeight =
      instance.options.lineHeight + instance.options.padding * 2;

    instance.values.forEach(value => {
      if (value.level !== undefined && value.level < level) {
        return;
      }

      switch (value.align) {
        case 'left':
          position = vec2(instance.options.margin, leftY);
          leftY += lineHeight + instance.options.lineMargin;
          break;
        case 'right':
          position = vec2(screen.x - instance.options.margin, rightY);
          rightY += lineHeight + instance.options.lineMargin;
          break;
      }

      instance.drawLabel(
        context,
        screen,
        Debug.prepareLabel(
          value.label ?? '',
          value.value ?? '',
          value.showLabel,
          true
        ),
        position,
        value.align,
        value.padding ?? instance.options.padding,
        value.font ?? instance.options.font,
        value.foregroundColour ?? instance.options.foregroundColour,
        value.backgroundColour ?? instance.options.backgroundColour
      );
    });

    instance.charts.forEach(chart => {
      if (chart.level !== undefined && chart.level < level) {
        return;
      }

      switch (chart.align) {
        case 'left':
          position = vec2(instance.options.margin, leftY);
          leftY += lineHeight + instance.options.lineMargin;
          break;
        case 'right':
          position = vec2(screen.x - instance.options.margin, rightY);
          rightY += lineHeight + instance.options.lineMargin;
          break;
      }

      instance.drawChart(
        context,
        screen,
        Debug.prepareLabel(chart.label ?? '', '', chart.showLabel, false),
        position,
        chart.align,
        chart.padding ?? instance.options.padding,
        chart.font ?? instance.options.font,
        chart.foregroundColour ?? instance.options.foregroundColour,
        chart.backgroundColour ?? instance.options.backgroundColour,
        chart.chartBackgroundColour,
        chart.values,
        chart.valueBufferSize,
        chart.valueBufferStride,
        chart.minValue,
        chart.maxValue,
        chart.barWidth,
        chart.barColours
      );
    });

    instance.markers.forEach(marker => {
      if (marker.level !== undefined && marker.level < level) {
        return;
      }

      if (marker.space === 'screen') {
        instance.drawMarker(context, screen, marker);
      }
    });

    instance.borders.forEach(border => {
      if (border.level !== undefined && border.level < level) {
        return;
      }

      if (border.space === 'screen') {
        instance.drawBorder(context, screen, border);
      }
    });

    context.restore();

    // Clear values, markers & borders ready for next frame
    instance.values.clear();
    instance.markers.clear();
    instance.borders.clear();
  }

  private static prepareLabel(
    label: string,
    value: string | number,
    showLabel: boolean,
    showValue?: boolean
  ) {
    const actualLabel = showLabel && label ? label : '';
    const actualValue = !!showValue && value !== '' ? value.toString() : '';
    const separator = actualLabel && actualValue ? ': ' : '';

    return `${actualLabel}${separator}${actualValue}`;
  }

  private drawLabel(
    context: Expo2DContext,
    screen: vec2,
    text: string,
    position: vec2,
    align: 'left' | 'right',
    padding: number,
    font: string,
    foregroundColour: string,
    backgroundColour: string
  ) {
    context.save();
    context.font = font;
    context.textBaseline = 'top';
    const backgroundSize = {
      width: context.measureText(text).width + padding * 2,
      height: this.options.lineHeight + padding * 2,
    };
    const x =
      align === 'right' ? position.x - backgroundSize.width : position.x;

    // Draw background
    context.fillStyle = backgroundColour;
    context.fillRect(
      x - padding,
      position.y - padding,
      backgroundSize.width,
      backgroundSize.height
    );

    // Draw text
    context.fillStyle = foregroundColour;
    context.fillText(text, x, position.y, screen.x);
    context.restore();
  }

  private drawChart(
    context: Expo2DContext,
    screen: vec2,
    label: string,
    position: vec2,
    align: 'left' | 'right',
    padding: number,
    font: string,
    foregroundColour: string,
    backgroundColour: string,
    chartBackgroundColour: string | undefined,
    values: number[],
    valueBufferSize: number,
    valueBufferStride: number,
    minValue: number,
    maxValue: number,
    barWidth: number,
    barColours:
      | {
          offset: number;
          colour: string;
        }[]
      | undefined
  ) {
    context.save();
    context.font = font;
    context.textBaseline = 'top';

    const chartSize = {
      width:
        barWidth * Math.ceil(valueBufferSize / Math.max(valueBufferStride, 1)),
      height: this.options.lineHeight + padding * 2,
    };
    const labelSize = {
      width: context.measureText(label).width,
      height: this.options.lineHeight,
    };
    const backgroundSize = {
      width: labelSize.width + padding + chartSize.width + padding * 2,
      height: this.options.lineHeight + padding * 2,
    };
    const x =
      align === 'right' ? position.x - backgroundSize.width : position.x;

    // Draw background
    context.fillStyle = backgroundColour;
    context.fillRect(
      x - padding,
      position.y - padding,
      backgroundSize.width,
      backgroundSize.height
    );

    // Draw label
    if (label) {
      context.fillStyle = foregroundColour;
      context.fillText(label, x, position.y, screen.x);
    }

    // Draw chart
    if (chartBackgroundColour) {
      context.fillStyle = chartBackgroundColour;
      context.fillRect(
        x + padding + labelSize.width + padding,
        position.y - padding,
        chartSize.width,
        chartSize.height
      );
    }

    const range = maxValue - minValue;
    const barOffset = vec2(
      x + padding + labelSize.width + padding,
      position.y - padding
    );
    for (
      let i = 0;
      i < Math.ceil(values.length / Math.max(valueBufferStride, 1));
      i++
    ) {
      let value: number;
      if (valueBufferStride <= 1) {
        value = values[i];
      } else {
        value =
          values
            .slice(i * valueBufferStride, (i + 1) * valueBufferStride)
            .reduce((a, b) => a + b, 0) / valueBufferStride;
      }

      const barSize = vec2(
        barWidth,
        Math.round((chartSize.height * (value - minValue)) / range)
      );
      const barPosition = vec2.add(
        barOffset,
        vec2(
          (values.length < valueBufferSize
            ? Math.ceil((valueBufferSize - values.length) / valueBufferStride) *
              barWidth
            : 0) +
            i * barWidth,
          chartSize.height - barSize.y
        )
      );
      const barColour =
        (barColours
          ? [...barColours].reverse().find(c => values[i] >= c.offset)?.colour
          : undefined) ?? foregroundColour;
      context.fillStyle = barColour;
      context.fillRect(barPosition.x, barPosition.y, barSize.x, barSize.y);
    }

    context.restore();
  }

  private drawMarker(
    context: Expo2DContext,
    screen: vec2,
    marker: DebugMarker
  ) {
    context.save();
    const position = marker.position ?? vec2();
    if (marker.showLabel || marker.showValue) {
      this.drawLabel(
        context,
        screen,
        Debug.prepareLabel(
          marker.label ?? '',
          marker.value ?? '',
          marker.showLabel,
          marker.showValue
        ),
        vec2.add(position ?? vec2(), marker.labelOffset),
        'left',
        marker.padding ?? this.options.padding,
        marker.font ?? this.options.font,
        marker.foregroundColour ?? this.options.foregroundColour,
        marker.backgroundColour ?? this.options.backgroundColour
      );
    }
    if (marker.showMarker) {
      context.lineWidth = 2;
      context.strokeStyle = context.fillStyle = marker.markerColour;
      switch (marker.markerStyle) {
        case 'x':
          this.drawCross(context, position, marker.markerSize);
          break;
        case '+':
          this.drawPlus(context, position, marker.markerSize);
          break;
        case '.':
          this.drawDot(context, position, marker.markerSize);
          break;
      }
    }
    context.restore();
  }

  private drawCross(context: Expo2DContext, position: vec2, size: number) {
    context.beginPath();
    const halfSize = size / 2;
    context.moveTo(position.x - halfSize, position.y - halfSize);
    context.lineTo(position.x + halfSize, position.y + halfSize);
    context.moveTo(position.x - halfSize, position.y + halfSize);
    context.lineTo(position.x + halfSize, position.y - halfSize);
    context.stroke();
  }

  private drawPlus(context: Expo2DContext, position: vec2, size: number) {
    context.beginPath();
    const halfSize = size / 2;
    context.moveTo(position.x, position.y - halfSize);
    context.lineTo(position.x, position.y + halfSize);
    context.moveTo(position.x - halfSize, position.y);
    context.lineTo(position.x + halfSize, position.y);
    context.stroke();
  }

  private drawDot(context: Expo2DContext, position: vec2, size: number) {
    context.beginPath();
    context.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
    context.fill();
  }

  private drawBorder(
    context: Expo2DContext,
    screen: vec2,
    border: DebugBorder
  ) {
    context.save();
    const position = border.position ?? vec2();
    if (border.showLabel || border.showValue) {
      this.drawLabel(
        context,
        screen,
        Debug.prepareLabel(
          border.label ?? '',
          border.value ?? '',
          border.showLabel,
          border.showValue
        ),
        vec2.add(position ?? vec2(), border.labelOffset),
        'left',
        border.padding ?? this.options.padding,
        border.font ?? this.options.font,
        border.foregroundColour ?? this.options.foregroundColour,
        border.backgroundColour ?? this.options.backgroundColour
      );
    }
    if (border.showBorder) {
      context.lineWidth = border.borderWidth;
      context.strokeStyle = context.fillStyle = border.borderColour;
      switch (border.borderStyle) {
        case 'solid':
          context.setLineDash([]);
          break;
        case 'dashed':
          context.setLineDash([border.borderDashSize, border.borderDashSize]);
          break;
        case 'dotted':
          context.setLineDash([border.borderWidth, border.borderWidth]);
          break;
      }
      switch (border.borderShape) {
        case 'rectangle':
          if (border.size) {
            this.drawRectangle(context, position, border.size);
          }
          break;
        case 'circle':
          if (border.radius) {
            this.drawCircle(context, position, border.radius);
          }
          break;
      }
    }
    context.restore();
  }

  private drawRectangle(context: Expo2DContext, position: vec2, size: vec2) {
    context.beginPath();
    context.rect(position.x, position.y, size.x, size.y);
    context.stroke();
  }

  private drawCircle(context: Expo2DContext, position: vec2, radius: number) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.stroke();
  }
}
