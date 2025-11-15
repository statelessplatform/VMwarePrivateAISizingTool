# VMware Private AI Sizing Tool

A community-built web application for calculating infrastructure requirements for VMware Private AI Foundation with NVIDIA deployments.

## 📋 Overview

This tool helps IT professionals and architects estimate the compute, storage, networking, and GPU resources needed for private AI deployments based on the official VMware Private AI Foundation Sizing Guide v9.

## ✨ Features

- **4-Step Wizard Interface**: Easy-to-follow configuration process
- **Quick Start Templates**: Pre-configured sizing for Pilot, Production, and Enterprise scenarios
- **Real-time Calculations**: Instant infrastructure sizing based on workload parameters
- **Executive PDF Report**: Generate 7-page professional reports for CIOs/CTOs
- **Multiple Export Formats**: JSON, TXT, and PDF exports
- **Shareable Configurations**: Generate links to share your sizing scenarios
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference with persistent storage
- **Privacy-First**: All calculations client-side, no data sent to servers

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Select `main` branch as source
4. Access at: `https://yourusername.github.io/repo-name/`

### Static Hosting

Upload `index.html`, `styles.css`, and `app.js` to any static hosting service:
- Netlify
- Vercel
- CloudFlare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

### Local Development

Simply open `index.html` in your web browser. No build process or server required.

```bash
# Clone the repository
git clone https://github.com/yourusername/vmware-ai-sizing-tool.git

# Open in browser
open index.html
```

## 📊 Sizing Models

The tool implements calculations for:

- **LLM Models**: 8B, 14B, 70B parameters
- **GPU Types**: NVIDIA H200, H100, L40s, A100
- **Use Cases**: RAG Chatbot, Inference, Training, GPU-as-a-Service
- **Deployments**: New VCF deployment or existing infrastructure expansion

## 📖 Usage

1. **Choose Template**: Start with a pre-configured template or custom configuration
2. **Configure Workload**: Define deployment type, use case, model size, and concurrent requests
3. **Select Hardware**: Choose GPU type and VCF deployment options
4. **View Results**: See comprehensive infrastructure requirements and export reports

## 🔧 Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties for theming, flexbox/grid layouts
- **Vanilla JavaScript**: No framework dependencies
- **jsPDF**: Client-side PDF generation (loaded from CDN)

## 📚 Resources

### Official VMware Documentation
- [VMware Private AI Sizing Guide](https://www.vmware.com/docs/sizing-ai-workloads-on-vcf)
- [VMware Blog Announcement](https://blogs.vmware.com/cloud-foundation/2025/10/24/introducing-the-private-ai-sizing-guide/)
- [Broadcom Support Portal](https://support.broadcom.com/group/ecx/productdownloads)
- [NVIDIA NGC Catalog](https://catalog.ngc.nvidia.com)

## ⚖️ Disclaimer

This is an **unofficial community tool** created for **educational purposes**. It is not affiliated with, endorsed by, or supported by Broadcom, VMware, or NVIDIA.

All sizing calculations are based on the official **VMware Private AI Foundation Sizing Guide v9**. For production deployments, please:

1. Consult with your Broadcom and NVIDIA representatives
2. Validate sizing with your specific workload requirements
3. Refer to official VMware documentation and support resources

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Guidelines

- Follow existing code style and structure
- Test changes in multiple browsers
- Update README if adding new features
- Ensure calculations match official VMware guidance

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 👨‍💻 Credits

Created by [StatelessPlatform.com](https://statelessplatform.com)

Based on VMware Private AI Foundation Sizing Guide v9 by Broadcom/VMware and NVIDIA.

## 🐛 Known Issues

- PDF generation requires internet connection for jsPDF CDN
- Large PDFs may take a few seconds to generate on slower devices

## 🔮 Roadmap

- [ ] Offline PDF generation capability
- [ ] Cost estimation based on hardware pricing
- [ ] Multiple simultaneous configuration comparison
- [ ] Export to Excel format
- [ ] Integration with VMware HCL for server validation

## 📞 Support

For issues with this tool:
- Open an issue on GitHub
- Visit [StatelessPlatform.com](https://statelessplatform.com)

For VMware Private AI Foundation support:
- Contact [Broadcom Support](https://support.broadcom.com)

---

**Version**: 1.0.0  
**Last Updated**: November 2025
