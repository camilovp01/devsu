import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Input() itemsPerPage: number = 5;

  itemsPerPageOptions = [5, 10, 20];
  totalPages: number = 0;
  currentPage: number = 1;

  ngOnInit() {
    this.calcTotalPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems']) {
      this.calcTotalPages();
    }
  }

  get currentStartIndex() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get currentEndIndex() {
    return Math.min(
      this.currentStartIndex + this.itemsPerPage,
      this.totalItems
    );
  }

  onItemsPerPageChange(event: any) {
    const value = event.target.value;
    this.itemsPerPage = +value;
    this.currentPage = 1;
    this.itemsPerPageChange.emit(this.itemsPerPage);
    this.pageChange.emit(this.currentPage);
    this.calcTotalPages();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  private calcTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
