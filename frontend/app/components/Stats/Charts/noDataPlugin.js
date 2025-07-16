export const createNoDataPlugin = (intl) => ({
  id: 'noData',
  afterDatasetsDraw: (chart, args, plugins) => {
    const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;

    ctx.save();

    if (plugins.noDataFlag) {
      ctx.fillStyle = 'rgba(53, 53, 53, 0.5)';
      ctx.fillRect(left, top, width, height);

      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(
        intl.formatMessage({ id: 'app.stats.noData' }),
        left + width / 2,
        top + height / 2,
      );
    }

    ctx.restore();
  }
});
