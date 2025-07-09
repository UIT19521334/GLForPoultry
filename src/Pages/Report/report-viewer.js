/* eslint-disable */
var viewerStyle = { height: '100%' };
var reportPath = 'AreaCharts.rdlc';
var reportData = [
    {
        value: [
            {
                SalesPersonID: 281,
                FullName: 'Ito',
                Title: 'Sales Representative',
                SalesTerritory: 'South West',
                Y2002: 0,
                Y2003: 28000,
                Y2004: 3018725,
            },
            {
                SalesPersonID: 282,
                FullName: 'Saraiva',
                Title: 'Sales Representative',
                SalesTerritory: 'Canada',
                Y2002: 25000,
                Y2003: 14000,
                Y2004: 3189356,
            },
            {
                SalesPersonID: 283,
                FullName: 'Cambell',
                Title: 'Sales Representative',
                SalesTerritory: 'North West',
                Y2002: 12000,
                Y2003: 13000,
                Y2004: 1930885,
            },
        ],
        name: 'AdventureWorksXMLDataSet',
    },
];

function viewReportClick(event) {
    var reportParams = [];
    reportParams.push({ name: 'ReportParameter1', labels: ['SO50756'], values: ['SO50756'] });
    event.model.parameters = reportParams;
}
function ReportViewer() {
    return (
        <div style={viewerStyle}>
            <BoldReportViewerComponent
                id="reportviewer-container"
                reportServiceUrl={'https://demos.boldreports.com/services/api/ReportViewer'}
                reportPath={'~/Resources/docs/sales-order-detail.rdl'}
            ></BoldReportViewerComponent>
        </div>
    );
}

export default ReportViewer;
