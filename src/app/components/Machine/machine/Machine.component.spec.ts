/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MachineComponent } from './Machine.component';

describe('MachineComponent', () => {
  let component: MachineComponent;
  let fixture: ComponentFixture<MachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
