export function getMaterialTypeLabel(materialTypeId, intl) {
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

export function getDeliveryMethodLabel(deliveryMethodId, intl) {
  switch (deliveryMethodId) {
    case 1:
      return intl.formatMessage({ id: 'app.requests.deliveryMethod.file' });
    case 2:
      return intl.formatMessage({ id: 'app.requests.deliveryMethod.mail' });
    case 3:
      return intl.formatMessage({ id: 'app.requests.deliveryMethod.fax' });
    case 4:
      return intl.formatMessage({ id: 'app.requests.deliveryMethod.url' });
    case 5:
      return intl.formatMessage({ id: 'app.requests.deliveryMethod.articleexchange' });
    case 6:
      return intl.formatMessage({ id: 'app.requests.deliveryMethod.other' });
    default:
      return null;
  }
}

export function getReasonUnfilledLabel(reasonUnfilledId, intl) {
  switch (reasonUnfilledId) {
    case 1:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.NotAvailableForILL' });
    case 2:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.NotHeld' });
    case 3:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.NotOnShelf' });
    case 4:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.ILLNotPermittedByLicense' });
    case 5:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.WrongRef' });
    case 6:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.MaxReqNumber' });
    case 7:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.Other' });
    default:
      return null;
  }
}
