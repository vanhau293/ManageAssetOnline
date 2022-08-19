package com.nashtech.rookies.AssetManagement.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nashtech.rookies.AssetManagement.model.entities.Accounts;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {
    private int requestId;
    private String state;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date returnedDate;
    private String requestedBy;
    private String acceptedBy;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date assignedDate;
    private String assetCode;
    private String assetName;
//    public RequestDto(int requestId, String state, Date returnedDate, String requestedBy, String acceptedBy, Date assignedDate, String assetCode, String assetName){
//        this.requestId=requestId;
//        this.state=state;
//        this.returnedDate=returnedDate;
//        this.requestedBy=requestedBy;
//        this.acceptedBy=acceptedBy;
//        this.assignedDate=assignedDate;
//        this.assetCode=assetCode;
//        this.assetName=assetName;
//    }
}
