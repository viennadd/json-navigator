# JSON Navigator - Chrome Extension for JSON Visualization

A Chrome extension that provides an enhanced visualization of JSON files using Monaco Editor and React Flow. This extension transforms JSON structures into interactive visual flowcharts, making it easier to understand and analyze JSON data.

## Features

- 🎯 Interactive JSON visualization using React Flow
- 📝 Syntax-highlighted JSON viewing with Monaco Editor
- 🌳 Tree-like structure visualization
- 🎨 Dark mode support
- ⚡ Built with Vite and React for optimal performance

## Tech Stack

- React
- Vite
- Monaco Editor
- React Flow
- Chrome Extensions API

## Installation

### For Users
1. TODO: chrome extension link

### For Development
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the `dist` directory as an unpacked extension in Chrome

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Build the project to ensure it works:
   ```bash
   npm run build
   ```
5. Test your changes by loading the `dist` directory as an unpacked extension in Chrome
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

## Development Guidelines

- Ensure the project builds successfully before submitting PRs
- Test the extension functionality in Chrome after building
- Follow the existing code style and formatting
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for powerful code editing capabilities
- [React Flow](https://reactflow.dev/) for the flow visualization
- [Vite](https://vitejs.dev/) for the blazing fast build tool


## Features TODO

- [x] support JSON  
- [x] generate xyflow graph
- [ ] option page for theme, font, editability settings  
- [x] status bar: cursor location, encoding, indentation  
- [ ] select json content when click to corresponding graph node
- [ ] actions: save, copy, expand-all, collapse-all, raw content, pretty print, minify (download raw content instead of just response.json())
- [x] auto layout once loaded, then zoom accordingly
- [x] show left/right side hiding bottons when hover on the top
- [x] show reactflow toolbar
- [ ] show size of the aggregated objects
- [ ] add JSON test case files
- [ ] expand/collapse button for all aggregated nodes
- [ ] synchronizing code&nodes selection and foldings 
- [ ] 