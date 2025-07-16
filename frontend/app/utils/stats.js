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

export function getAggregatedBorrowingStatusLabel(aggregatedBorrowingStatus, intl) {
  switch (aggregatedBorrowingStatus) {
    case 'New':
      return intl.formatMessage({ id: 'app.requests.newrequest' });
    case 'Reiterated':
      return intl.formatMessage({ id: 'app.requests.reiterated' });
    case 'Received':
      return intl.formatMessage({ id: 'app.requests.documentReady' });
    case 'Not received':
      return intl.formatMessage({ id: 'app.requests.documentNotReady' });
    case 'Not received but fulfilled by lender':
      return intl.formatMessage({ id: 'app.requests.notReceivedButFulfilledByLender' });
    case 'In progress':
      return intl.formatMessage({ id: 'app.requests.inProgress' });
    case 'Canceled':
      return intl.formatMessage({ id: 'app.requests.canceled' });
    case 'Patron direct request':
      return intl.formatMessage({ id: 'app.requests.patronDirectRequest' });
    default:
      return null;
  }
}

export function getAggregatedLendingStatusLabel(aggregatedLendingStatus, intl) {
  switch (aggregatedLendingStatus) {
    case 'Fulfilled':
      return intl.formatMessage({ id: 'app.requests.fulfilled' });
    case 'Not fulfilled':
      return intl.formatMessage({ id: 'app.requests.notReceived' });
    case 'In progress':
      return intl.formatMessage({ id: 'app.requests.inProgress' });
    case 'Canceled':
      return intl.formatMessage({ id: 'app.requests.canceled' });
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
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.LibraryPolicy' });
    case 7:
      return intl.formatMessage({ id: 'app.requests.notfulfill_type.Other' });
    default:
      return null;
  }
}

export function getWorkingTimeLabel(workingTime, intl) {
  switch (workingTime) {
    case 'Within a day':
      return intl.formatMessage({ id: 'app.stats.workingTime.withinDay' });
    case 'Within a week':
      return intl.formatMessage({ id: 'app.stats.workingTime.withinWeek' });
    case 'Longer than a week':
      return intl.formatMessage({ id: 'app.stats.workingTime.moreWeek' });
    default:
      return null;
  }
}
