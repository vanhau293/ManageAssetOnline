package com.nashtech.rookies.AssetManagement.model.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter

public class AccountLoginDto {

	    @NotEmpty
	    private String username;

	    @NotEmpty
	    private String password;

		public AccountLoginDto(String username, String password) {
			this.username = username;
			this.password = password;
		}
}