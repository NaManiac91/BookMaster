import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  buildMonthCalendarCells,
  CalendarDayCell,
  CalendarDotLevel,
  toISODateString
} from "../../utils/date-time.utils";

@Component({
  selector: 'app-status-calendar',
  templateUrl: './status-calendar.component.html',
  styleUrls: ['./status-calendar.component.scss'],
})
export class StatusCalendarComponent implements OnChanges {
  @Input() month: Date = new Date();
  @Input() monthLabel: string = '';
  @Input() weekDayKeys: string[] = [];
  @Input() selectedDateIso: string = '';
  @Input() todayIsoDate: string = toISODateString(new Date());
  @Input() dotLevelsByDate: Record<string, CalendarDotLevel> = {};
  @Input() defaultDotLevel: CalendarDotLevel = 'none';
  @Input() canGoToPreviousMonth: boolean = true;

  @Output() monthChange = new EventEmitter<number>();
  @Output() daySelected = new EventEmitter<CalendarDayCell>();

  calendarCells: Array<CalendarDayCell | null> = [];

  ngOnChanges(_: SimpleChanges): void {
    this.calendarCells = buildMonthCalendarCells(this.month, this.todayIsoDate);
  }

  getDotLevel(isoDate: string): CalendarDotLevel {
    return this.dotLevelsByDate[isoDate] || this.defaultDotLevel;
  }

  selectCalendarDay(dayCell: CalendarDayCell | null) {
    if (!dayCell || !dayCell.selectable) {
      return;
    }
    this.daySelected.emit(dayCell);
  }
}
