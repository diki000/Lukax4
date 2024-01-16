import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredMapComponent } from './registered-map.component';

describe('RegisteredMapComponent', () => {
  let component: RegisteredMapComponent;
  let fixture: ComponentFixture<RegisteredMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
