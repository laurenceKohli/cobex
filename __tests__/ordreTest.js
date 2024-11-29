import { cleanUpDatabase } from './utils.js';
import mongoose from 'mongoose';

// Import des fichiers à tester
import './example-spec.js';
import './utilisateurs-spec.js';
import './poste-spec.js';
import './parcours-spec.js';
import './resultat-spec.js';

describe('Ordre des tests', () => {
    it('should run tests in order', () => {
        cleanUpDatabase();
        expect(true).toBe(true);
    });
});