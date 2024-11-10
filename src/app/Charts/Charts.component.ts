import {
  Component,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
emptyFill;
import {
  catchError,
  concatMap,
  map,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';

import {
  lightningChart,
  emptyLine,
  UIElementBuilders,
  emptyFill,
  SolidFill,
  SolidLine,
  ColorRGBA,
  AxisTickStrategies,
  AxisScrollStrategies,
  UILayoutBuilders,
  UIOrigins,
  PointShape,
  Themes,
  Color,
  disableThemeEffects,
  Point,
  ConstantLine,
  translatePoint,
} from '@arction/lcjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./Charts.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent implements AfterViewInit {
  @Input() selectedRow: any;
  @Input() currentPointID: string | undefined;
  @Input() currentDir: number | undefined;
  @Output() chartClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngAfterViewInit(): void {
    const colors = {
      darkOrange: ColorRGBA(236, 109, 99),
      lightOrange: ColorRGBA(240, 131, 92),
      black: ColorRGBA(0, 0, 0),
      darkBlue: ColorRGBA(0, 0, 139),
    };

    // Colors for Axis Band
    const bandColors = {
      red: ColorRGBA(255, 0, 0, 100),
      orange: ColorRGBA(240, 108, 0, 100),
      yellow: ColorRGBA(240, 236, 0, 100),
      green: ColorRGBA(60, 179, 113, 220),
    };

    // Defines position and color for each Axis band
    const bandThreshold = [
      { color: bandColors.red, yStart: 3, yEnd: 4 },
      { color: bandColors.orange, yStart: 2, yEnd: 3 },
      { color: bandColors.yellow, yStart: 1, yEnd: 2 },
      { color: bandColors.green, yStart: -1, yEnd: 1 },
      { color: bandColors.yellow, yStart: -2, yEnd: -1 },
      { color: bandColors.orange, yStart: -3, yEnd: -2 },
      { color: bandColors.red, yStart: -4, yEnd: -3 },
    ];

    // Indicators ConstantLines
    const indicatorConstLines = [
      { color: ColorRGBA(255, 0, 0, 100), pos: 1 },
      { color: ColorRGBA(240, 108, 0, 100), pos: 0.4 },
      { color: ColorRGBA(240, 236, 0, 100), pos: 0.25 },
      { color: ColorRGBA(60, 179, 113, 100), pos: 0.1 },
    ];

    const findPeak = (
      chart: {
        engine: { clientLocation2Engine: (arg0: any, arg1: number) => any };
      },
      series: { solveNearestFromScreen: (arg0: { x: number; y: any }) => any },
      locationClientX: any
    ) => {
      const pointsArray = [];
      // Solve all nearest data points between -15 and +15 pixels from where the constant line is.
      const locationEngine = chart.engine.clientLocation2Engine(
        locationClientX,
        0
      );
      for (
        let xLocationEngine = locationEngine.x - 15;
        xLocationEngine < locationEngine.x + 15;
        xLocationEngine++
      ) {
        const solveNearestResult = series.solveNearestFromScreen({
          x: xLocationEngine,
          y: locationEngine.y,
        });
        if (solveNearestResult) {
          pointsArray.push(solveNearestResult.location);
        }
      }
      if (pointsArray.length === 0) return;
      // Find the peak from all the solved points.
      const peak = pointsArray.reduce((prev, cur) => {
        if (!cur) return prev;
        return cur.y > prev.y ? cur : prev;
      }, pointsArray[Math.round(pointsArray.length / 2)]);
      return peak;
    };

    const dashboard = lightningChart()
      .Dashboard({
        container: 'chart',
        numberOfColumns: 5,
        numberOfRows: 6,
        // Disable shadow/glow effects for added performance.
        theme: disableThemeEffects(Themes.light),
      })
      .setSplitterStyle(emptyLine);

    // Function to set labels on the Dashboard splitters
    function setDashboardSplitterLabels(title: string, position: Point) {
      dashboard
        .addUIElement(UIElementBuilders.TextBox)
        .setText(title)
        .setTextRotation(-90)
        .setPosition(position)
        .setOrigin(UIOrigins.LeftTop)
        .setMouseInteractions(false);
    }
    // Fetch the Dashboard splitters labels ans set them
    fetch('./labels.json')
      .then((d) => d.json())
      .then((labelData) => {
        const { dashboardSplitterLabels } = labelData;
        dashboardSplitterLabels.forEach((el: { title: string; pos: Point }) => {
          setDashboardSplitterLabels(el.title, el.pos);
        });
      });

    // Chart with AxisBands on background
    {
      // Create Chart XY and style it
      const chart = dashboard
        .createChartXY({
          columnIndex: 0,
          rowIndex: 0,
          columnSpan: 1,
          rowSpan: 1,
        })
        // Remove title
        .setTitle('')
        .setMouseInteractionRectangleFit(false);

      chart.forEachAxis((axis) => axis.setAnimationScroll(false));

      const axisY = chart
        .getDefaultAxisY()
        .setTitle('TWF [g]')
        .setInterval({ start: -4, end: 4, stopAxisAfter: true })
        // Remove grid lines from Numeric Y axis
        .setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy) =>
          tickStrategy.setMajorTickStyle((tickStyle) =>
            tickStyle.setGridStrokeStyle(emptyLine)
          )
        )
        .setMouseInteractions(false);

      const axisX = chart
        .getDefaultAxisX()
        .setTitle('[sec]')
        // Remove grid lines from Time X axis
        .setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy) =>
          tickStrategy.setMajorTickStyle((tickStyle) =>
            tickStyle.setGridStrokeStyle(emptyLine)
          )
        );

      // Add axis bands
      bandThreshold.forEach((el) => {
        axisY
          .addBand(false)
          .setValueStart(el.yStart)
          .setValueEnd(el.yEnd)
          .setMouseInteractions(false)
          .setFillStyle(new SolidFill({ color: el.color }));
      });

      // Create Series
      const series = chart
        .addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } })
        .setStrokeStyle(
          new SolidLine({
            fillStyle: new SolidFill({ color: colors.black }),
            thickness: 1,
          })
        );

      // Add random data to the series
      for (let timestampMs = 0; timestampMs < 5000; timestampMs += 5) {
        series.add({
          x: timestampMs,
          y: -1 + Math.random() * 2,
        });
      }
    }

    // // Waveform Chart with Annotations and Cursors
    {
      const chartWaveForm = dashboard
        .createChartXY({
          columnIndex: 1,
          rowIndex: 0,
          columnSpan: 1,
          rowSpan: 1,
        })
        .setTitle('');

      chartWaveForm.forEachAxis((axis) => axis.setAnimationScroll(false));

      // Initial Cursor Positions
      let cursorStartXY = { x: 1500, y: 0 };
      let cursorEndXY = { x: 3500, y: 0 };

      // Create Series
      const series = chartWaveForm
        .addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } })
        .setStrokeStyle(
          new SolidLine({
            fillStyle: new SolidFill({ color: colors.darkBlue }),
            thickness: 1,
          })
        )
        .setCursorInterpolationEnabled(false);

      const axisY = chartWaveForm
        .getDefaultAxisY()
        .setTitle('Magnitude [g]')
        .setInterval({ start: -2, end: 2, stopAxisAfter: true });

      const axisX = chartWaveForm
        .getDefaultAxisX()
        .setTitle('Time[s]')
        .setTickStrategy(AxisTickStrategies.Time);

      // ConstantLines are used for "custom cursor"
      const cursorConstantLine1 = axisX
        .addConstantLine(false)
        .setInteractionMoveByDragging(false)
        .setValue(cursorStartXY.x);
      const cursorConstantLine2 = axisX
        .addConstantLine(false)
        .setInteractionMoveByDragging(false)
        .setValue(cursorEndXY.x);

      // Annotations are made with LCJS UI.
      const annotationLeftLayout = chartWaveForm
        .addUIElement(UILayoutBuilders.Column, { x: axisX, y: axisY })
        .setPosition({
          x: axisX.getInterval().start,
          y: axisY.getInterval().end,
        })
        .setOrigin(UIOrigins.LeftTop)
        .setMouseInteractions(false);
      // Rows for left annotation
      const labelDeltaT = annotationLeftLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(
          `Delta T(s) = ${(
            cursorConstantLine1.getValue() - cursorConstantLine2.getValue()
          ).toFixed(2)}`
        );
      const labelDeltaHz = annotationLeftLayout
        .addElement(UIElementBuilders.TextBox)
        .setText('Delta f(Hz) = 0.6');
      const labelDeltaCPM = annotationLeftLayout
        .addElement(UIElementBuilders.TextBox)
        .setText('Delta f(CPM) = 39.4');

      // Right annotation.
      const annotationRightLayout = chartWaveForm
        .addUIElement(UILayoutBuilders.Column, { x: axisX, y: axisY })
        .setPosition({ x: axisX.getInterval().end, y: axisY.getInterval().end })
        .setOrigin(UIOrigins.RightTop)
        .setMouseInteractions(false);
      // Rows for right annotation
      const labelP = annotationRightLayout
        .addElement(UIElementBuilders.TextBox)
        .setText('P 1300 PUL');
      const labelPoint = annotationRightLayout
        .addElement(UIElementBuilders.TextBox)
        .setText('Point: MIB-Dir ');
      const labelDate = annotationRightLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(new Date().toLocaleDateString());

      // Position annotations inside chart area.
      chartWaveForm.getDefaultAxisX().onIntervalChange((start, end) => {
        annotationLeftLayout.setPosition({
          x: axisX.getInterval().start,
          y: axisY.getInterval().end,
        });
        annotationRightLayout.setPosition({
          x: axisX.getInterval().end,
          y: axisY.getInterval().end,
        });
      });
      chartWaveForm.getDefaultAxisY().onIntervalChange((start, end) => {
        annotationLeftLayout.setPosition({
          x: axisX.getInterval().start,
          y: axisY.getInterval().end,
        });
        annotationRightLayout.setPosition({
          x: axisX.getInterval().end,
          y: axisY.getInterval().end,
        });
      });

      // Add random data to the series
      series.addArrayY(
        new Array(500).fill(0).map((_) => -1 + Math.random() * 2),
        // X step
        10,
        // X start
        0
      );

      const cursorPointSeries = chartWaveForm
        .addPointSeries({
          pointShape: PointShape.Circle,
        })
        .setPointSize(20)
        .setMouseInteractions(false)
        .setCursorEnabled(false)
        .setAutoScrollingEnabled(false);

      function updateCursor(
        cursorConstantLine: ConstantLine,
        locationClientX: any
      ) {
        // Find the peak from all the solved points.
        const peak = findPeak(chartWaveForm, series, locationClientX);
        // Update cursor positions.
        if (cursorConstantLine === cursorConstantLine1) {
          cursorStartXY = peak;
        } else {
          cursorEndXY = peak;
        }

        cursorConstantLine.setValue(peak.x);
        cursorPointSeries.clear().add([cursorStartXY, cursorEndXY]);

        // Update Annotations tied to Cursor.
        labelDeltaT.setText(
          `Delta T(s) = ${(
            cursorConstantLine2.getValue() - cursorConstantLine1.getValue()
          ).toFixed(2)}`
        );
      }

      // Add custom mouse interactions for constant lines
      cursorConstantLine1.onMouseDrag((_, event) =>
        updateCursor(cursorConstantLine1, event.clientX)
      );
      cursorConstantLine2.onMouseDrag((_, event) =>
        updateCursor(cursorConstantLine2, event.clientX)
      );

      setTimeout(() => {
        // Translate initial cursor locations from axis to client.
        const cursorStartXYEngine = translatePoint(
          cursorStartXY,
          { x: axisX, y: axisY },
          chartWaveForm.engine.scale
        );
        const cursorStartXYClient = chartWaveForm.engine.engineLocation2Client(
          cursorStartXYEngine.x,
          cursorStartXYEngine.y
        );
        const cursorEndXYEngine = translatePoint(
          cursorEndXY,
          { x: axisX, y: axisY },
          chartWaveForm.engine.scale
        );
        const cursorEndXYClient = chartWaveForm.engine.engineLocation2Client(
          cursorEndXYEngine.x,
          cursorEndXYEngine.y
        );
        updateCursor(cursorConstantLine1, cursorStartXYClient.x);
        updateCursor(cursorConstantLine2, cursorEndXYClient.x);
      });
    }

    // Indicators
    {
      fetch('assets/timeIndications.json')
        .then((d) => d.json())
        .then((seriesInfo) => {
          const { time, band } = seriesInfo;

          createIndicatorCharts(time);
          createIndicatorCharts(band);

          function createIndicatorCharts(seriesData: any[]) {
            const chartList = seriesData.map(
              (
                channel: {
                  posX: any;
                  posY: any;
                  yAxisStart: any;
                  yAxisEnd: any;
                  chartTitle: any;
                  axisYTitle: any;
                  data: any;
                },
                i: number
              ) => {
                //  Extract all necessary data from json file
                const {
                  posX,
                  posY,
                  yAxisStart,
                  yAxisEnd,
                  chartTitle,
                  axisYTitle,
                  data,
                } = channel;

                const chart = dashboard.createChartXY({
                  rowIndex: posY,
                  columnIndex: posX,
                });

                chart.forEachAxis((axis) => axis.setAnimationScroll(false));

                // Add PointLine series
                const series = chart
                  .addPointLineSeries({
                    pointShape: PointShape.Circle,
                  })
                  .setPointSize(10);

                // Add data to the series
                series.add(data);

                const axisX = chart.getDefaultAxisX().setTitle('');
                // Configure 10% extra "air" on start and end of X axis.
                const dataInterval = series.getXMax() - series.getXMin();
                axisX.setInterval({
                  start: series.getXMin() - 0.1 * dataInterval,
                  end: series.getXMax() + 0.1 * dataInterval,
                });

                const axisY = chart
                  .getDefaultAxisY()
                  .setInterval({ start: yAxisStart, end: yAxisEnd })
                  .setTickStrategy(
                    AxisTickStrategies.Numeric,
                    (tickStrategy) =>
                      tickStrategy.setMajorTickStyle((tickStyle) =>
                        tickStyle.setGridStrokeStyle(emptyLine)
                      )
                    // .setMinorTickStyle((tickStyle) =>
                    //     tickStyle.setGridStrokeStyle(emptyLine),
                    // ),
                  );

                if (chartTitle) {
                  chart
                    .setTitle(chartTitle)
                    .setTitlePosition('series-left-top')
                    .setTitleFont((font) => font.setSize(14));
                }
                if (axisYTitle) {
                  chart.setTitle('');
                  axisY.setTitle(axisYTitle);
                }

                // Add ConstantLines
                const indicatorLies = indicatorConstLines.map((lineData, i) => {
                  return axisY
                    .addConstantLine(false)
                    .setEffect(false)
                    .setValue(lineData.pos)
                    .setStrokeStyle(
                      new SolidLine({
                        thickness: 2,
                        fillStyle: new SolidFill({ color: lineData.color }),
                      })
                    )
                    .setMouseInteractions(false);
                });

                // Remove axisX Tick from all charts, except the first
                if (i < seriesData.length - 1) {
                  axisX
                    .setTickStrategy(
                      AxisTickStrategies.DateTime,
                      (ticks) =>
                        ticks
                          .setMajorTickStyle((majorTicks) =>
                            majorTicks
                              .setLabelFillStyle(emptyFill)
                              .setTickStyle(emptyLine)
                              .setTickLength(0)
                              .setTickPadding(0)
                          )
                          .setMinorTickStyle((minorTicks) =>
                            minorTicks
                              .setLabelFillStyle(emptyFill)
                              .setTickStyle(emptyLine)
                              .setTickLength(0)
                              .setTickPadding(0)
                          )
                      // .setGreatTickStyle((greatTick) =>
                      //     greatTick
                      //         // .setLabelFillStyle(emptyFill)
                      //         .setTickStyle(emptyLine)
                      //         .setTickLength(0)
                      //         .setTickPadding(0),
                      // ),
                    )
                    .setStrokeStyle(emptyLine)
                    .setScrollStrategy(undefined);
                } else {
                  axisX.setTickStrategy(AxisTickStrategies.DateTime);
                }

                return chart;
              }
            );
            const syncedAxes = chartList.map(
              (chart: { getDefaultAxisX: () => any }) => chart.getDefaultAxisX()
            );
            //synchronizeAxisIntervals(...syncedAxes)
          }
        });
    }

    // 3D spectrum charts
    {
      fetch('assets/spectrum.json')
        .then((d) => d.json())
        .then((spectrumInfo) => {
          const { spectrumData } = spectrumInfo;
          for (let col = 0; col < spectrumData.length; col++) {
            createSpectrumChart2(spectrumData[col]);
          }
        });

      function createSpectrumChart2(spectrumData: {
        col: any;
        row: any;
        timestamp: any;
        annotations: any;
        staticCursorPositions: any;
        data: any;
      }) {
        const {
          col,
          row,
          timestamp,
          annotations,
          staticCursorPositions,
          data,
        } = spectrumData;

        const chart3D = dashboard
          .createChart3D({
            columnIndex: col,
            rowIndex: row + 1,
            columnSpan: 1,
            rowSpan: 2,
          })
          .setTitle('')
          .setMouseInteractionZoom(false);

        const linkToFullscreen = chart3D
          .addUIElement()
          .setText('Fullscreen')
          .setPosition({ x: 0, y: 0 })
          .setOrigin(UIOrigins.LeftBottom)
          .setMargin(4);
        // .setDraggingMode(UIDraggingModes.notDraggable)
        linkToFullscreen.onMouseClick(() => {
          window.location.href = `${window.location.origin}/example2`;
        });

        chart3D.forEachAxis((axis) => axis.setAnimationScroll(false));

        const xAxis = chart3D.getDefaultAxisX();
        const yAxis = chart3D.getDefaultAxisY();
        const zAxis = chart3D
          .getDefaultAxisZ()
          .setTickStrategy(AxisTickStrategies.Empty);

        const series = new Array(timestamp.length)
          .fill(0)
          .map((el, seriesRow) => {
            const seriesLine = chart3D.addLineSeries().setStrokeStyle(
              new SolidLine({
                fillStyle: new SolidFill({ color: colors.darkBlue }),
                thickness: -1,
              })
            );

            // zAxis
            //     .addCustomTick(UIElementBuilders.AxisTickMajor)
            //     // Set tick text.
            //     .setTextFormatter(() => timestamp[seriesRow])
            //   //  Set tick location.
            //     .setValue(seriesRow)

            // TODO: Make array, add just 1 (Array.map)
            data.forEach((yPoint: any, i: any) => {
              seriesLine.add({
                x: i,
                y: yPoint,
                z: seriesRow,
              });
            });

            return seriesLine;
          });

        // chart3D.onSeriesBackgroundMouseWheel(zoomHandler)
        chart3D.onBackgroundMouseWheel(zoomHandler);
        series.forEach((seriesLine) => {
          seriesLine.onMouseWheel(zoomHandler);
        });

        function zoomHandler(
          obj: any,
          event: { wheelDelta?: any; clientX?: number; clientY?: number }
        ) {
          // zoom in or zoom out
          const zoom = event.wheelDelta > 0;
          // get translated mouse coordinates
          // const locationRelative = chart3D.translateCoordinate(event, chart3D.relative)
          // Get height of cell
          const cellHeight = chart3D.getSizePixels().y;
          // set Y or X axis depending on mouse position
          //  const axis = locationRelative.y > cellHeight / 2 ? yAxis : xAxis

          // const { start, end } = axis.getInterval()
          // const int = end - start
          // // Zoom action
          // axis.setInterval({
          //     start: start,
          //     end: zoom ? end - int / 100 : end + int / 100,
          // })
        }
      }
    }

    // 2D spectrum charts
    {
      fetch('assets/spectrum.json')
        .then((d) => d.json())
        .then((spectrumInfo) => {
          const { spectrumData } = spectrumInfo;
          for (let col = 0; col < spectrumData.length; col++) {
            createSpectrumChart(spectrumData[col]);
          }
        });

      function createSpectrumChart(spectrumData: {
        col: any;
        row: any;
        annotations: any;
        staticCursorPositions: any;
        data: any;
      }) {
        const { col, row, annotations, staticCursorPositions, data } =
          spectrumData;

        const spectrumChart = dashboard
          .createChartXY({
            columnIndex: col,
            rowIndex: row,
            columnSpan: 1,
            rowSpan: 1,
          })
          .setTitle('');

        spectrumChart.forEachAxis((axis) => axis.setAnimationScroll(false));

        // Create Series
        const series = spectrumChart
          .addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } })
          .setStrokeStyle(
            new SolidLine({
              fillStyle: new SolidFill({ color: colors.darkBlue }),
              thickness: 1,
            })
          )
          .setCursorInterpolationEnabled(false);

        // Add Y data to the series
        series.addArrayY(data);

        const axisY = spectrumChart
          .getDefaultAxisY()
          .setScrollStrategy(AxisScrollStrategies.expansion)
          .setInterval({ start: 0, end: 1.5, stopAxisAfter: false });

        const axisX = spectrumChart.getDefaultAxisX();

        //  Right Top annotation.
        const annotationRightLayout = spectrumChart
          .addUIElement(UILayoutBuilders.Column, { x: axisX, y: axisY })
          .setPosition({
            x: axisX.getInterval().end,
            y: axisY.getInterval().end,
          })
          .setOrigin(UIOrigins.RightTop)
          .setMouseInteractions(false);

        // Rows for right top annotation
        const labelVelocity = annotationRightLayout
          .addElement(UIElementBuilders.TextBox)
          .setText(annotations.velocity);
        const labelUnits = annotationRightLayout
          .addElement(UIElementBuilders.TextBox)
          .setText(annotations.units);

        // ConstantLines are used for "custom cursor" (static)
        const cursorConstantLineArray = staticCursorPositions.map(
          (line: { x: number }, i: any) => {
            return axisX
              .addConstantLine(false)
              .setMouseInteractions(false)
              .setEffect(false)
              .setValue(line.x);
          }
        );

        // Labels  for static cursors
        const labelConstantLineArray = staticCursorPositions.map(
          (line: { name: string; x: any }, i: any) => {
            return spectrumChart
              .addUIElement(UIElementBuilders.TextBox, { x: axisX, y: axisY })
              .setText(line.name)
              .setTextRotation(-90)
              .setPosition({ x: line.x, y: axisY.getInterval().end })
              .setOrigin(UIOrigins.RightTop)
              .setMouseInteractions(false)
              .setTextFont((font) => font.setSize(10));
          }
        );

        // Dynamic Cursor. Attached to highest nearest point
        const annotationCursor = axisX
          .addConstantLine(true)
          .setMouseInteractions(false)
          .setEffect(false);

        // Label for dynamic cursors
        const annotationCursorLabel = spectrumChart
          .addUIElement(UIElementBuilders.TextBox, { x: axisX, y: axisY })
          .setOrigin(UIOrigins.RightTop)
          .setMouseInteractions(false)
          .setTextFont((font) => font.setSize(10));

        // Position right top annotation inside chart area at axis X scroll
        spectrumChart.getDefaultAxisX().onIntervalChange((start, end) => {
          annotationRightLayout.setPosition({
            x: axisX.getInterval().end,
            y: axisY.getInterval().end,
          });
        });

        // Position right top and static annotations inside chart area at axis Y scroll
        spectrumChart.getDefaultAxisY().onIntervalChange((start, end) => {
          annotationRightLayout.setPosition({
            x: axisX.getInterval().end,
            y: axisY.getInterval().end,
          });
          labelConstantLineArray.forEach(
            (
              cursorAnnotation: {
                setPosition: (arg0: { x: any; y: number }) => void;
              },
              i: string | number
            ) => {
              cursorAnnotation.setPosition({
                x: staticCursorPositions[i].x,
                y: axisY.getInterval().end,
              });
            }
          );
        });

        // Add double click event for dynamic cursor
        spectrumChart.onSeriesBackgroundMouseDoubleClick((_, event) => {
          updateCursor(event.clientX, true);
        });

        // // Add right click event for dynamic annotation (created with html)
        spectrumChart.onSeriesBackgroundMouseDown((_, event) => {
          // Run event only if right mouse btn was clicked
          if (event.which !== 3) {
            return;
          }
          updateCursor(event.clientX, false);
        });

        function updateCursor(locationClientX: number, isCursor: boolean) {
          // Find the peak from all the solved points.
          const peak = findPeak(spectrumChart, series, locationClientX);

          if (isCursor) {
            annotationCursor.setValue(peak.x);
            annotationCursorLabel
              .setText(`${peak.y.toFixed(2)}@${peak.x.toFixed(2)}`)
              .setPosition({ x: peak.x, y: axisY.getInterval().end });
          } else {
            const nearestPointEngine = translatePoint(
              peak,
              series.scale,
              spectrumChart.engine.scale
            );
            const nearestPointClient =
              spectrumChart.engine.engineLocation2Client(
                nearestPointEngine.x,
                nearestPointEngine.y
              );
            textBox.innerText = `x: ${peak.x.toFixed(2)} y: ${peak.y.toFixed(
              2
            )}`;
            textBox.style.left = `${
              nearestPointClient.x - textBox.clientWidth / 2
            }px`;
            textBox.style.top = `${
              nearestPointClient.y - textBox.clientHeight - 20
            }px`;
            // textBox.style.opacity = 1
          }
        }

        // Create HTML annotation
        const textBox = document.createElement('div');
        spectrumChart.engine.container.append(textBox);

        textBox.style.position = 'fixed';
        textBox.style.backgroundColor = 'rgba(124,124,124,0.9)';
        textBox.style.color = 'white';
        textBox.style.fontSize = '12px';
        textBox.style.border = 'solid black 2px';
        textBox.style.borderRadius = '5px';
        textBox.style.pointerEvents = 'none';
        textBox.style.zIndex = '1';
        textBox.style.transition = 'left 0.2s, top 0.2s, opacity 0.2s';
        textBox.style.opacity = '0.0';
        textBox.style.width = '50px';
        textBox.style.padding = '2px';
      }
    }
  }
}
