import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
self.MonacoEnvironment = {
    baseUrl: "http://abc.com"
};


loader.config({ monaco })


