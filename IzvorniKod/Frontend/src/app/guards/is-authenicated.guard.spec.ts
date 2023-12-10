import { TestBed } from '@angular/core/testing';

import { IsAuthenicatedGuard } from './is-authenicated.guard';

describe('IsAuthenicatedGuard', () => {
  let guard: IsAuthenicatedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAuthenicatedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
