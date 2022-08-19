package TestService;

import com.nashtech.rookies.AssetManagement.exceptions.ConstraintViolateException;
import com.nashtech.rookies.AssetManagement.exceptions.ResourceNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.request.CreateAssignmentRequest;
import com.nashtech.rookies.AssetManagement.model.dto.respond.AssignmentDetailRespondDTO;
import com.nashtech.rookies.AssetManagement.model.entities.Accounts;
import com.nashtech.rookies.AssetManagement.model.entities.Asset;
import com.nashtech.rookies.AssetManagement.model.entities.Assignment;
import com.nashtech.rookies.AssetManagement.model.entities.Information;
import com.nashtech.rookies.AssetManagement.repository.AccountsRepository;
import com.nashtech.rookies.AssetManagement.repository.AssetRepository;
import com.nashtech.rookies.AssetManagement.repository.AssignmentRepository;
import com.nashtech.rookies.AssetManagement.security.UserLocal;
import com.nashtech.rookies.AssetManagement.services.impl.AssignmentServiceImpl;
import com.nashtech.rookies.AssetManagement.utils.MyDateUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class AssignmentServiceTest {

    private ModelMapper modelMapper;

    private AssignmentRepository assignmentRepository;

    private UserLocal userLocal;

    private AssetRepository assetRepository;

    private AccountsRepository accountsRepository;

    private MyDateUtils myDateUtils;

    private AssignmentServiceImpl assignmentServiceImpl;


    @BeforeEach
    public void initTest(){
        modelMapper = mock(ModelMapper.class);
        assignmentRepository = mock(AssignmentRepository.class);
        userLocal = mock(UserLocal.class);
        assetRepository = mock(AssetRepository.class);
        accountsRepository = mock(AccountsRepository.class);
        myDateUtils = mock(MyDateUtils.class);
        assignmentServiceImpl = new AssignmentServiceImpl(modelMapper,assignmentRepository,userLocal,assetRepository,accountsRepository,myDateUtils);
    }


    @Test
    public void getAssignmentById_shouldThrowResourceNotFoundException_whenNotFoundAssignment(){
        when(assignmentRepository.findById(0)).thenReturn(Optional.empty());
        ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
                () -> assignmentServiceImpl.getAssignmentById(0)
        );
        assertThat(exception.getMessage(), is("Assignment Not Found With ID: 0"));
    }
    @Test
    public void getAssignmentById_shouldReturnAssignment_whenAssignmentFound(){

        AssignmentDetailRespondDTO assignmentDetailRespondDTO = mock(AssignmentDetailRespondDTO.class);

        Information information = new Information("Xuan Khoi", "Bui");

        Asset asset = new Asset(107,"HRX42EKMX3000001", "Laptop Test 10", "create asset - demo specification 10" );

        Accounts accounts = new Accounts(852, "xuankb2", information);
        Accounts creator = new Accounts(852, "xuankb2", information);

        Assignment assignment = new Assignment(myDateUtils.getDate("27/08/2022"),
                "Nhu ta", "WAITING_FOR_ACCEPTANCE",accounts, creator, asset);

        AssignmentDetailRespondDTO respondDTO = new AssignmentDetailRespondDTO(
                "xuankb2", 852, "xuankb2", "Xuan Khoi Bui", "HRX42EKMX3000001",
                "Laptop Test 10", "Nhu ta"
                , "WAITING_FOR_ACCEPTANCE", 107, myDateUtils.getDate("27/08/2022"), "create asset - demo specification 10"
        );


        Optional<Assignment> assignmentOptional = Optional.of(assignment);

        when(assignmentRepository.findById(80)).thenReturn(assignmentOptional);

        Optional<AssignmentDetailRespondDTO> detailRespondDTO = assignmentOptional.map(AssignmentDetailRespondDTO::new);

        assertThat(respondDTO, is(detailRespondDTO.get()));

        AssignmentDetailRespondDTO result = assignmentServiceImpl.getAssignmentById(80);

        assertThat(result, is(detailRespondDTO.get()));

    }

    @Test
    public void createAssignment_shouldReturnResourceNotFoundException_whenAssetNotFound(){
        Information information = new Information("Xuan Khoi", "Bui");
        Accounts accounts = new Accounts(852, "xuankb2", information);
        Asset asset = new Asset(107,"HRX42EKMX3000001", "Laptop Test 10", "create asset - demo specification 10" );

        CreateAssignmentRequest createAssignmentRequest = new CreateAssignmentRequest("Nhu ta", 852,myDateUtils.getDate("27/08/2022"), 0 );
        Assignment assignment = new Assignment(myDateUtils.getDate("27/08/2022"), "Nhu ta");
        when(modelMapper.map(createAssignmentRequest, Assignment.class)).thenReturn(assignment);
        when(accountsRepository.findByuserName("xuankb2")).thenReturn(Optional.of(accounts));
        when(assetRepository.findById(createAssignmentRequest.getAssetId())).thenReturn(Optional.empty());


        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> assignmentServiceImpl.createNewAssignment(createAssignmentRequest)
        );

        assertThat(exception.getMessage(), is("Asset Not Found With ID: 0"));
    }


    @Test
    public void createAssignment_shouldReturnResourceNotFoundException_whenAccountNotFound(){
        Information information = new Information("Xuan Khoi", "Bui");
        Accounts accounts = new Accounts(852, "xuankb2", information);
        Asset asset = new Asset(79,"LT000002", "Laptop Test 10", "create asset - demo specification 10" );

        CreateAssignmentRequest createAssignmentRequest = new CreateAssignmentRequest("Nhu ta", 0,myDateUtils.getDate("27/08/2022"), 79);
        Assignment assignment = new Assignment(myDateUtils.getDate("27/08/2022"), "Nhu ta");
        when(modelMapper.map(createAssignmentRequest, Assignment.class)).thenReturn(assignment);
        when(accountsRepository.findByuserName("xuankb2")).thenReturn(Optional.of(accounts));
        when(assetRepository.findById(createAssignmentRequest.getAssetId())).thenReturn(Optional.of(asset));
        when(accountsRepository.findById(createAssignmentRequest.getAssignedToId())).thenReturn(Optional.empty());


        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> assignmentServiceImpl.createNewAssignment(createAssignmentRequest)
        );

        assertThat(exception.getMessage(), is("Account Not Found With ID: 0"));
    }


    @Test
    public void createAssignment_shouldReturnConstraintViolateException_whenAssetNotAvailable(){
        Information information = new Information("Xuan Khoi", "Bui");
        Accounts accounts = new Accounts(852, "xuankb2", information);
        Asset asset = new Asset(60,"LT000001", "Laptop Test 6", "create asset - demo specification 6", "ASSIGNED" );

        CreateAssignmentRequest createAssignmentRequest = new CreateAssignmentRequest("Nhu ta", 852,myDateUtils.getDate("27/08/2022"), 60);
        Assignment assignment = new Assignment(myDateUtils.getDate("27/08/2022"), "Nhu ta");
        when(modelMapper.map(createAssignmentRequest, Assignment.class)).thenReturn(assignment);
        when(accountsRepository.findByuserName("xuankb2")).thenReturn(Optional.of(accounts));
        when(assetRepository.findById(createAssignmentRequest.getAssetId())).thenReturn(Optional.of(asset));
        when(accountsRepository.findById(createAssignmentRequest.getAssignedToId())).thenReturn(Optional.of(accounts));


        ConstraintViolateException exception = assertThrows(ConstraintViolateException.class,
                () -> assignmentServiceImpl.createNewAssignment(createAssignmentRequest)
        );

        assertThat(exception.getMessage(), is("Asset not in available !"));
    }

    @Test
    public void createAssignment_shouldReturnNewAssignment_whenAssetAvailable(){

        Information information = new Information("Xuan Khoi", "Bui");
        Accounts accounts = new Accounts(852, "xuankb2", information);
        Asset asset = new Asset(79,"LT000002", "Laptop Test 10", "create asset - demo specification 10" );

        CreateAssignmentRequest createAssignmentRequest = new CreateAssignmentRequest("Nhu ta", 852,myDateUtils.getDate("27/08/2022"), 60);
        Assignment assignment = new Assignment(myDateUtils.getDate("27/08/2022"), "Nhu ta");
        when(modelMapper.map(createAssignmentRequest, Assignment.class)).thenReturn(assignment);
        when(accountsRepository.findByuserName("xuankb2")).thenReturn(Optional.of(accounts));
        when(assetRepository.findById(createAssignmentRequest.getAssetId())).thenReturn(Optional.of(asset));
        when(accountsRepository.findById(createAssignmentRequest.getAssignedToId())).thenReturn(Optional.of(accounts));
    }


}
