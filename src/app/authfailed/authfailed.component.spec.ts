import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthfailedComponent } from './authfailed.component';

describe('AuthfailedComponent', () => {
  let component: AuthfailedComponent;
  let fixture: ComponentFixture<AuthfailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthfailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthfailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
