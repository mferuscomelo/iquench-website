export interface PopupData {
    title: string;
    icon: 'success' | 'error' | 'info' | 'warning';
    text: string;
    confirmButtonText?: string;
    showCloseButton?: boolean;
    cancelButtonText?: string;
    showDoNotShowAgainCheckbox?: boolean;
    doNotShowAgain?: string;
}
