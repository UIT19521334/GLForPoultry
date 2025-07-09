/* eslint-disable */
var designerStyle = { height: '100%', width: '100%', position: 'absolute' };

function ReportDesigner() {
    return (
        <div style={designerStyle} className="App">
            <BoldReportDesignerComponent
                id="reportdesigner_container"
                serviceUrl={'https://demos.boldreports.com/services/api/ReportingAPI'}
            ></BoldReportDesignerComponent>
        </div>
    );
}
export default ReportDesigner;
