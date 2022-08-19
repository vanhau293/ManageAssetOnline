package TestService;

import com.nashtech.rookies.AssetManagement.exceptions.ResourceNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.RequestDto;
import com.nashtech.rookies.AssetManagement.model.entities.*;
import com.nashtech.rookies.AssetManagement.repository.*;
import com.nashtech.rookies.AssetManagement.security.UserLocal;
import com.nashtech.rookies.AssetManagement.services.impl.RequestServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RequestServiceTest {
    UserLocal userLocal;
    private RequestRepository requestRepository;
    private ModelMapper modelMapper;
    private AssignmentRepository assignmentRepository;
    private InformationRepository informationRepository;
    private AssetRepository assetRepository;
    private AccountsRepository accountsRepository;
    private RequestServiceImpl requestServiceImpl;

    @BeforeEach
    public void beforeEach(){
        userLocal = mock(UserLocal.class);
        modelMapper = mock(ModelMapper.class);
        requestRepository = mock(RequestRepository.class);
        assignmentRepository = mock(AssignmentRepository.class);
        informationRepository = mock(InformationRepository.class);
        assetRepository = mock(AssetRepository.class);
        accountsRepository = mock(AccountsRepository.class);
        requestServiceImpl = new RequestServiceImpl(requestRepository,informationRepository,modelMapper,
                assignmentRepository, assetRepository,accountsRepository,userLocal);
    }
    @Test
    public void listRequest_ShouldReturnAllRequest_WhenNoSearchNoFilter() throws ParseException {
        List<Request> requestList =new ArrayList<>();
        Request request = new Request(1,"WAITING_FOR_RETURNING", new Date(), new Accounts("account1","",new Role()),
                new Accounts("","",new Role()),new Assignment(1,new Date(),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new Date(),null));
        requestList.add(request);
        RequestDto requestDto = new RequestDto(1, "WAITING_FOR_RETURNING", new Date(),
                "account1", "", new Date(),"","");
        when(modelMapper.map(request,RequestDto.class)).thenReturn(requestDto);
        when(requestRepository.findAll()).thenReturn(requestList);
        List<RequestDto> result = requestServiceImpl.listRequest("WAITING_FOR_RETURNING,COMPLETED", "","");
        assertThat(result.size(), is(requestList.size()));
    }
    @Test
    public void listRequest_ShouldReturnListRequestAssignmentByState_WhenHaveStateHaveSearchHaveDate() throws ParseException {
        List<Request> requestList =new ArrayList<>();

        Format formatter = new SimpleDateFormat("dd/MM/yyyy");
        String s = formatter.format(new Date());
        Request request = new Request(1,"WAITING_FOR_RETURNING", new Date(), new Accounts("account1","",new Role()),
                new Accounts("account2","",new Role()),new Assignment(1,new Date(),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new SimpleDateFormat("dd/MM/yyyy").parse(s),null));
        requestList.add(request);
        RequestDto requestDto = new RequestDto(1, "WAITING_FOR_RETURNING", new Date(),
                "account1", "", new Date(),"","");
        when(modelMapper.map(request,RequestDto.class)).thenReturn(requestDto);
        when(requestRepository.findAll()).thenReturn(requestList);
        List<RequestDto> result = requestServiceImpl.listRequest("WAITING_FOR_RETURNING", "acc",s);
        assertThat(result.size(), is(requestList.size()));
    }
    @Test
    public void listRequest_ShouldThrowResourceNotFoundException_WhenHaveNotStateCompleted() throws ParseException {
        List<Request> requestList =new ArrayList<>();

        Format formatter = new SimpleDateFormat("dd/MM/yyyy");
        String s = formatter.format(new Date());
        Request request = new Request(1,"WAITING_FOR_RETURNING", new Date(), new Accounts("account1","",new Role()),
                new Accounts("account2","",new Role()),new Assignment(1,new SimpleDateFormat("dd/MM/yyyy").parse(s),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new Date(),null));
        requestList.add(request);
        RequestDto requestDto = new RequestDto(1, "WAITING_FOR_RETURNING", new Date(),
                "account1", "", new Date(),"","");
        when(modelMapper.map(request,RequestDto.class)).thenReturn(requestDto);
        when(requestRepository.findAll()).thenReturn(requestList);
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> requestServiceImpl.listRequest("COMPLETED","","")
        );
        assertThat(exception.getMessage(), is("This page is empty"));
    }
    @Test
    public void completeRequest_ShouldReturnSuccessfully_WhenDataValid(){
        Request request = new Request(1,"WAITING_FOR_RETURNING", new Date(), new Accounts("account1","",new Role()),
                new Accounts("account2","",new Role()),new Assignment(1,new Date(),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new Date(),null));

        when(requestRepository.findById(1)).thenReturn(Optional.of(request));
        when(accountsRepository.findByuserName(userLocal.getLocalUserName())).thenReturn(Optional.of(new Accounts("account2","",new Role())));
        ResponseEntity<?> response = requestServiceImpl.completeRequest(1);
        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void completeRequest_ShouldThrowResourceNotFoundException_WhenNotFoundRequest(){
        Request request = new Request(1,"WAITING_FOR_RETURNING", new Date(), new Accounts("account1","",new Role()),
                new Accounts("account2","",new Role()),new Assignment(1,new Date(),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new Date(),null));

        when(requestRepository.findById(1)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> requestServiceImpl.completeRequest(1)
        );
        assertThat(exception.getMessage(), is("Request not found"));
    }
    @Test
    public void cancelRequest_ShouldReturnSuccessfully_WhenDataValid(){
        Request request = new Request(1,"WAITING_FOR_RETURNING", new Date(), new Accounts("account1","",new Role()),
                new Accounts("account2","",new Role()),new Assignment(1,new Date(),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new Date(),null));

        when(requestRepository.findById(1)).thenReturn(Optional.of(request));
        when(accountsRepository.findByuserName(userLocal.getLocalUserName())).thenReturn(Optional.of(new Accounts("account2","",new Role())));
        ResponseEntity<?> response = requestServiceImpl.cancelRequest(1);
        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void createRequest_ShouldReturnSuccessfully_WhenDataValid(){

        when(assignmentRepository.findById(1)).thenReturn(Optional.of(new Assignment(1,new Date(),"","WAITING_FOR_RETURING",null,null,
                new Asset(1,"","", "", new Date(), "","",null,null),new Date(),null)));
        when(accountsRepository.findById(1)).thenReturn(Optional.of(new Accounts("account2","",new Role())));
        ResponseEntity<?> response = requestServiceImpl.createRequestReturnAsset(1,1);
        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }
    @Test
    public void createRequest_ShouldThrowResourceNotFoundException_WhenAssignmentIdNotFound(){

        when(assignmentRepository.findById(1)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> requestServiceImpl.createRequestReturnAsset(1,1)
        );
        assertThat(exception.getMessage(), is("Not Found Assignment With ID: 1"));
    }
    @Test
    public void createRequest_ShouldThrowResourceNotFoundException_WhenAccountIdNotFound(){

        when(assignmentRepository.findById(1)).thenReturn(Optional.of(new Assignment()));
        when(accountsRepository.findById(1)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> requestServiceImpl.createRequestReturnAsset(1,1)
        );
        assertThat(exception.getMessage(), is("Not Found User With ID: 1"));
    }
}
