import { CapMapLink } from 'capacitor-map-link';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { CapLinking } from 'capacitor-linking';

window.CapLinking = CapLinking;

window.getApps = () => {
  CapMapLink.getApps({
    latitude: 38.8976763,
    longitude: -77.0387185,
    title: 'Your destination',
  })
    .then(apps => {
      console.log(apps);
    })
    .catch(error => {
      console.error(error);
    });
};

window.showActionSheet = () => {
  ActionSheet.showActions({
    title: 'Photo Options',
    message: 'Select an option to perform',
    options: [
      {
        title: 'Upload',
      },
      {
        title: 'Share',
      },
      {
        title: 'Remove',
        style: ActionSheetButtonStyle.Destructive,
      },
    ],
  });
};

window.openMapLink = () => {
  CapMapLink.showLocation({
    latitude: 38.8976763,
    longitude: -77.0387185,
    title: 'Your destination',
  })
    .then(() => {
      console.log('Map opened');
    })
    .catch(error => {
      console.error(error);
    });
};
