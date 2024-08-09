import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with tooltip hidden', () => {
    expect(component.isTooltipVisible).toBeFalsy();
  });

  it('should isTooltipVisible to be true', () => {
    component.onMouseEnter();
    expect(component.isTooltipVisible).toBeTruthy();
  });

  it('should isTooltipVisible to be false', () => {
    component.onMouseLeave();
    expect(component.isTooltipVisible).toBeFalsy();
  });
});
