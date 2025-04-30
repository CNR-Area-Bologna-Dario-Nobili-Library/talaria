export default function getMaterialTypeLabel(materialTypeId, intl) {
  // console.log('getMaterialTypeLabel', materialTypeId);

  switch (materialTypeId) {
    case '1':
      return intl.formatMessage({ id: 'app.references.article' });
    case '2':
      return intl.formatMessage({ id: 'app.references.book' });
    case '3':
      return intl.formatMessage({ id: 'app.references.thesis' });
    case '4':
      return intl.formatMessage({ id: 'app.references.cartography' });
    case '5':
      return intl.formatMessage({ id: 'app.references.manuscript' });
    default:
      return null;
  }
}
