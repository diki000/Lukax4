import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredMapComponent } from './unregistered-map.component';

describe('UnregisteredMapComponent', () => {
  let component: UnregisteredMapComponent;
  let fixture: ComponentFixture<UnregisteredMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnregisteredMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
