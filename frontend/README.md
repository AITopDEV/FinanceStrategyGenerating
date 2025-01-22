# Key Choice PDF Generator

A React-based web application that allows users to generate PDFs by uploading documents and selecting images. Built with TypeScript and Tailwind CSS.

## Features

- Document upload functionality for:
  - Preliminary Assessment Documents
  - Credit Proposal Documents
- Property address input
- Multiple image selection with horizontal scrolling gallery
- Custom-styled components including:
  - File upload dropzones
  - Image selection cards
  - Custom scrollbar
- PDF generation capability

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/dreamjet31/key_choice-generation_page.git
```

2. Navigate to the project directory

```bash
cd key-choice-pdf-generator
```

3. Install dependencies

```bash
npm install
# or
yarn install
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── App.tsx
│   ├── FileUpload/
│   │   └── index.tsx
│   └── ImageSelector/
│       ├── index.tsx
│       └── styles.css
├── main.tsx
└── index.css
```

## Usage

1. Upload Documents:

   - Drag and drop or click to upload Preliminary Assessment and Credit Proposal documents

2. Enter Property Address:

   - Input the property address in the provided text field

3. Select Images:

   - Click on images in the horizontal gallery to select/deselect them
   - Use mouse wheel to scroll through the image gallery horizontally

4. Generate PDF:
   - Click the "Generate" button to create the PDF with selected content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Icons for the icon set
- Tailwind CSS for styling
- TypeScript for type safety
