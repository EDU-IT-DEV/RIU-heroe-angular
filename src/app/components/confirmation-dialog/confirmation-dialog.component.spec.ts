import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from './confirmation-dialog.component';
import { By } from '@angular/platform-browser';

describe('ConfirmationDialog', () => {
  let component: ConfirmationDialog;
  let fixture: ComponentFixture<ConfirmationDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialog>>;

  const mockDialogData = { message: 'Are you sure you want to proceed?' };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmationDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the confirmation message', () => {
    const messageElement = fixture.debugElement.query(By.css('h2[mat-dialog-title]'));
    expect(messageElement).not.toBeNull();
    expect(messageElement.nativeElement.textContent).toContain(mockDialogData.message);
  });

  it('should close the dialog with true when confirm is called', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when cancel is called', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should call confirm method when confirm button is clicked', () => {
    spyOn(component, 'confirm').and.callThrough();
    const confirmButton = fixture.debugElement.query(By.css('.confirm-button'));
    expect(confirmButton).not.toBeNull();

    confirmButton.nativeElement.click();

    expect(component.confirm).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call cancel method when cancel button is clicked', () => {
    spyOn(component, 'cancel').and.callThrough();
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
    expect(cancelButton).not.toBeNull();

    cancelButton.nativeElement.click();

    expect(component.cancel).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog with true when confirm button is clicked', () => {
    const confirmButton = fixture.debugElement.query(By.css('.confirm-button'));
    expect(confirmButton).not.toBeNull();

    confirmButton.nativeElement.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when cancel button is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
    expect(cancelButton).not.toBeNull();

    cancelButton.nativeElement.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
