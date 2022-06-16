export class TraktFormatter {
  private readonly _startDate: moment.Moment;
  private readonly _endDate: moment.Moment;

  constructor(startDate: moment.Moment, endDate: moment.Moment) {
    this._startDate = startDate;
    this._endDate = endDate;
  }
}
