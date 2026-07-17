import os
from datetime import datetime

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)

from reportlab.lib.styles import getSampleStyleSheet

from app.services.insights_service import generate_insights


def create_report(dataset_id, file_path):

    os.makedirs("reports", exist_ok=True)

    pdf_path = f"reports/report_{dataset_id}.pdf"

    insights = generate_insights(file_path)

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "DataPilot AI Analysis Report",
            styles["Title"]
        )
    )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            f"Generated: {datetime.now()}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            f"Rows: {insights['rows']}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Columns: {insights['columns']}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            "AI Insights",
            styles["Heading2"]
        )
    )

    elements.append(
        Paragraph(
            insights["ai_insights"],
            styles["BodyText"]
        )
    )

    doc.build(elements)

    return {
        "message": "Report generated successfully",
        "report_path": pdf_path
    }