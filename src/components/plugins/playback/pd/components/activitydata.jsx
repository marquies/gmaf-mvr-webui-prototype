import React, { Component, useEffect, useState} from 'react';
import PlugInError from '../../../error/pluginerror';


function ActivityData(props) {
    
    const [heartRate, setHeartRate] = useState(null);
    const [altitude, setAltitude] = useState(null);



    useEffect(() => {   
        setDataForTimeCode(props.timecode);
    }, [props.timecode]);

    function setDataForTimeCode(timecode){
        var records= readData();
        let dataIndex = Math.round(timecode);
        let datarow= records[dataIndex];

        if(!datarow){
            //console.log("Datarow incomplete!: ", datarow);
            //setHeartRate("No Data");
            return;
        }
        let heartRate= datarow["record.heart_rate[bpm]"];
        let altitude= datarow["record.enhanced_altitude[m]"];

        var altitudeRounded = Math.round(altitude * 100) / 100; 

        setHeartRate(heartRate);
        setAltitude(altitudeRounded);
        
    }

    function readData(){
                 
        if(!props.data.file){
    
            return null;
        }

        const base64String = props.data.file;

        // Step 1: Remove the base64 prefix and decode the string
        const csvString = atob(base64String.split(",")[1]);

        // Step 2: Split CSV into lines
        const lines = csvString.trim().split("\n");

        // Step 3: Extract headers
        const headers = lines[0].split(",");

        // Step 4: Map CSV rows to objects
        const records = lines.slice(1).map(line => {
            const values = line.split(",");
            let record = {};
            headers.forEach((header, index) => {
                record[header.trim()] = values[index].trim().replace(/"/g, '');
            });
            return record;
        });

        // Output the result
        return records;
    }


    function canRender(){
    
        if(props.data == undefined || props.timecode == undefined) {
            console.error("Activity Data incomplete or TimeCode Setter not set :", props.data);
            return false;
        }

        return true;
    }

    return (
        <div id="plugin" className=''>

            {canRender() ? 
            <div>
                <div>
                    <h3 className='m-3 ms-5'>Activity </h3>
                </div>
                <div className='m-3'>
                        <div className="d-flex mt-2">
                            <i className="fa fa-heart fsize2"></i>        
                            <div className='h3 ms-2 mt-1'>HR {heartRate}</div>
                        </div>
                        <div className='d-flex mt-2'>
                            <i className="fa fa-arrow-up fsize2"></i>
                            <div className='h3 ms-2 mt-1'>Altitude {altitude}</div>
                        </div>
                    </div>
                </div>
            
            : <PlugInError/>}
        </div>    
    );

}

export default ActivityData;