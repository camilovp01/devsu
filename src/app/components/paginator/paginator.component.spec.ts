import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages on init', () => {
    component.totalItems = 25;
    component.itemsPerPage = 5;
    component.ngOnInit();
    expect(component.totalPages).toBe(5);
  });

  it('should recalculate total pages when totalItems changes', () => {
    component.totalItems = 30;
    component.itemsPerPage = 10;
    component.ngOnChanges({
      totalItems: {
        currentValue: 30,
        previousValue: 20,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.totalPages).toBe(3);
  });

  it('should emit page change on prevPage', () => {
    component.currentPage = 2;
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
    component.prevPage();
    expect(component.currentPage).toBe(1);
    expect(pageChangeSpy).toHaveBeenCalledWith(1);
  });

  it('should not go below page 1 on prevPage', () => {
    component.currentPage = 1;
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
    component.prevPage();
    expect(component.currentPage).toBe(1);
    expect(pageChangeSpy).not.toHaveBeenCalled();
  });

  it('should emit page change on nextPage', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(pageChangeSpy).toHaveBeenCalledWith(2);
  });

  it('should not go beyond totalPages on nextPage', () => {
    component.currentPage = 3;
    component.totalPages = 3;
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(component.currentPage).toBe(3);
    expect(pageChangeSpy).not.toHaveBeenCalled();
  });
});
