import '@testing-library/jest-dom';
import { config } from '@vue/test-utils';

// Configuration globale pour Vue Test Utils
config.global.stubs = {
    'router-link': true,
    'router-view': true,
};
