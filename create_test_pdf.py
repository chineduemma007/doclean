import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_path = r"C:\Users\user\Documents\docsense_test_document.pdf"
    
    # Setup document
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor='#0f172a',
        spaceAfter=20
    )
    
    h1_style = ParagraphStyle(
        'DocHeading1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor='#0369a1',
        spaceBefore=15,
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'DocHeading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor='#0891b2',
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor='#334155',
        spaceAfter=8
    )

    story = []
    
    # Page 1: Cover Page
    story.append(Spacer(1, 100))
    story.append(Paragraph("DocSense AI Corporate Case Study", title_style))
    story.append(Paragraph("Annual Operational, Strategic & Financial Analysis Report", styles['Normal']))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Document Classification: DIGITAL READ ONLY (Searchable Context)", styles['Italic']))
    story.append(Spacer(1, 30))
    story.append(Paragraph("Prepared for the Paritok Hackathon Benchmark Suite", styles['Normal']))
    story.append(PageBreak())
    
    # Page 2: Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "This document details the corporate structure, strategic growth targets, and active risk mitigation protocols "
        "for the upcoming fiscal years. Over the last four quarters, the organization has focused heavily on shifting legacy "
        "on-premise compute nodes to elastic cloud architectures. This migration has driven down computational margins significantly.",
        body_style
    ))
    story.append(Paragraph(
        "Furthermore, our primary objective is to scale operations across three new global regions, leveraging modern containerization "
        "and distributed database instances to ensure single-digit millisecond latency for consumer transaction gateways.",
        body_style
    ))
    story.append(PageBreak())
    
    # Page 3: Strategic Goals & Growth
    story.append(Paragraph("2. Strategic Goals & Growth Pillars", h1_style))
    story.append(Paragraph(
        "To achieve a market cap target expansion of 2.5x within the next eighteen months, we are implementing a three-pillar growth strategy:",
        body_style
    ))
    story.append(Paragraph("Pillar 1: Geographical Expansion", h2_style))
    story.append(Paragraph(
        "We are establishing localized sales, marketing, and support structures in the EMEA and APAC regions. By setting up edge data centers in Frankfurt, Tokyo, and Sydney, we will resolve regional compliance issues and minimize user latency profiles.",
        body_style
    ))
    story.append(Paragraph("Pillar 2: AI-Driven Developer Integration", h2_style))
    story.append(Paragraph(
        "We are adding advanced contextual search and code review assistants directly into our developer SDK. By integrating Paritok-4B context-compression endpoints, we will minimize token overhead for API consumers, enabling cheap, high-fidelity code synthesis directly inside the developer CLI.",
        body_style
    ))
    story.append(Paragraph("Pillar 3: Enterprise Partnership Acquisition", h2_style))
    story.append(Paragraph(
        "We are targeting mid-market enterprises looking to migrate from legacy mainframes to cloud-native platforms. We have signed pre-contract agreements with four primary financial institutions in South America to pilot our high-speed gateway.",
        body_style
    ))
    story.append(PageBreak())
    
    # Page 4: Financial Projections & Targets
    story.append(Paragraph("3. Financial Analysis & Targets", h1_style))
    story.append(Paragraph(
        "The financial performance of the past quarter was exceptionally strong, led by enterprise product licensing agreements. "
        "The overall revenue target for Q3 is established at $42.8M, representing a 14% year-over-year increase compared to the same period last year.",
        body_style
    ))
    story.append(Paragraph(
        "Net profit margins have stabilized at 18.5%, driven by a 22% reduction in cloud compute spend and database replication efficiency. "
        "Our forecast projects an operational free cash flow of $9.2M by the end of Q4, which will be reinvested into edge computing hardware.",
        body_style
    ))
    story.append(Paragraph(
        "Research and development (R&D) allocations will grow from 12% of total revenue to 15% to support the new AI framework initiatives.",
        body_style
    ))
    story.append(PageBreak())
    
    # Page 5: Risk Assessment & Mitigation
    story.append(Paragraph("4. Risk Assessment & Threat Mitigation", h1_style))
    story.append(Paragraph(
        "The organization actively monitors potential headwinds across our operational layers. Below are the key risk categories and their respective mitigations:",
        body_style
    ))
    story.append(Paragraph("Threat Category A: Upstream Compute Dependencies", h2_style))
    story.append(Paragraph(
        "Our AI processing infrastructure relies on upstream GPU allocations. To mitigate potential supply shortages, we are building fallback pipelines on secondary multi-cloud providers, allowing model execution to route automatically to AWS or Azure instances during spikes.",
        body_style
    ))
    story.append(Paragraph("Threat Category B: Enterprise Client Churn", h2_style))
    story.append(Paragraph(
        "To protect recurring licensing revenue, we are implementing a proactive client success monitoring system. Weekly usage reports will trigger early intervention alerts if database execution requests drop below the baseline.",
        body_style
    ))
    story.append(Paragraph("Threat Category C: Regional Compliance Volatility", h2_style))
    story.append(Paragraph(
        "Varying data localization laws in APAC require strict storage controls. We have partnered with local legal counsel in Singapore to ensure all user database tables are isolated and encrypted under local parameters.",
        body_style
    ))
    
    # Build document
    doc.build(story)
    print(f"Digital PDF successfully created at: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
