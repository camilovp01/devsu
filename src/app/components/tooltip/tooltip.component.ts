import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  @Input() tooltipText: string = '';
  isTooltipVisible = false;
  tooltipStyle = {
    top: '0px',
    left: '0px',
  };

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isTooltipVisible = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isTooltipVisible = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.tooltipStyle = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`,
    };
  }
}
