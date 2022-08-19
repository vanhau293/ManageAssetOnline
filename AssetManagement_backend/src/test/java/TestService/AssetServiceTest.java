package TestService;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.nashtech.rookies.AssetManagement.exceptions.ApiDeniedException;
import com.nashtech.rookies.AssetManagement.exceptions.ResourceNotFoundException;
import com.nashtech.rookies.AssetManagement.model.dto.request.CreateAssetRequest;
import com.nashtech.rookies.AssetManagement.model.entities.Asset;
import com.nashtech.rookies.AssetManagement.model.entities.Assignment;
import com.nashtech.rookies.AssetManagement.model.entities.Category;
import com.nashtech.rookies.AssetManagement.repository.AssetRepository;
import com.nashtech.rookies.AssetManagement.repository.AssignmentRepository;
import com.nashtech.rookies.AssetManagement.repository.CategoryRepository;
import com.nashtech.rookies.AssetManagement.repository.InformationRepository;
import com.nashtech.rookies.AssetManagement.security.UserLocal;
import com.nashtech.rookies.AssetManagement.services.impl.AdminServiceImpl;
import com.nashtech.rookies.AssetManagement.services.impl.AssetServiceImpl;
import com.nashtech.rookies.AssetManagement.utils.MyDateUtils;

//@ExtendWith(MockitoException.class)
public class AssetServiceTest {

	@Mock
	AssetRepository assetRepository;
	@Mock
	UserLocal userLocal;
	@Mock
	InformationRepository informationRepository;
	@Mock
	AdminServiceImpl adminServiceImpl;
	@Mock
	MyDateUtils myDateUtils;
	@Mock
	CategoryRepository categoryRepository;
	@Mock
	AssignmentRepository assignmentRepository;
	@Mock
	Asset asset ;
	@Mock
	Assignment assignment;
	@InjectMocks
	AssetServiceImpl assetServiceImpl;


	@Test
	public void deleteAsset_ReturnStatusOK_WhenAssetValid() {
		Asset asset = mock(Asset.class);
		AssetRepository assetRepository = mock(AssetRepository.class);
		AssetServiceImpl assetServiceImpl = new AssetServiceImpl(informationRepository, adminServiceImpl, myDateUtils, categoryRepository, assignmentRepository,assetRepository);
		when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
		ResponseEntity<?> result = assetServiceImpl.deleteAsset(1);
		assertThat(result.getStatusCode(), is(HttpStatus.OK));

	}
	@Test
	public void deleteAsset_ReturnResourceNotFoundException_WhenAssetNotFound() {
		asset = mock(Asset.class);
		AssetRepository assetRepository = mock(AssetRepository.class);
		AssetServiceImpl assetServiceImpl = new AssetServiceImpl(informationRepository, adminServiceImpl, myDateUtils, categoryRepository, assignmentRepository,assetRepository);
		when(assetRepository.findById(1)).thenReturn(Optional.empty());
		ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
				() -> assetServiceImpl.deleteAsset(1));
		assertThat(exception.getMessage(), is("Asset Not Found With ID : " + 1));

	}
	@Test
	public void deleteAsset_ReturnApiDeniedException_WhenAssetHaveAssignment() {
		asset = mock(Asset.class);
		assignment = mock(Assignment.class);
		AssetRepository assetRepository = mock(AssetRepository.class);
		AssetServiceImpl assetServiceImpl = new AssetServiceImpl(informationRepository, adminServiceImpl, myDateUtils, categoryRepository, assignmentRepository,assetRepository);
		when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
		@SuppressWarnings("unchecked")
		List<Assignment> list = mock(List.class);
		when(asset.getAssignments()).thenReturn(list);
		ApiDeniedException exception = Assertions.assertThrows(ApiDeniedException.class,
				() -> assetServiceImpl.deleteAsset(1));
		assertThat(exception.getMessage(), is("Cannot delete the asset because it belongs to one or more historical assignments. " +
				"If the asset is not able to be used anymore, please update its state in Edit Asset page” "));

	}
//
//	public void getAssetById_ReturnStatusOk_WhenDataValid(){
//		Asset asset = mock(Asset.class);
//		AssetDto assetDto = mock(AssetDto.class);
//		Category category = mock(Category.class);
//		AssignmentDto assignmentDto = mock(AssignmentDto.class);
//		List<Assignment> list = mock(List.class);
//		List<AssignmentDto> listDtos = mock(List.class);
//
//		AssetRepository assetRepository = mock(AssetRepository.class);
//		ModelMapper modelMapper = mock(ModelMapper.class);
//		AssetServiceImpl assetServiceImpl = new AssetServiceImpl(informationRepository, adminServiceImpl, myDateUtils, categoryRepository, assignmentRepository, assetRepository);
//		when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
//		when(modelMapper.map(asset, AssetDto.class)).thenReturn(assetDto);
//		when(assetDto.getCategoryName()).thenReturn(asset.getCategory().getCategoryName());
//		when(list).thenReturn(asset.getAssignments());
////		when(listDtos).thenReturn(assetDto.getAssignmentDtoList());
//
//		ResponseEntity<?> result = assetServiceImpl.getAssetById(1);
//		assertThat(result.getStatusCode(), is(HttpStatus.OK));
//	}
//	@Test
//	public void createNewAsset_ReturnObjectDto_WhenAssetValid() {
//		Asset asset = mock(Asset.class);
//		CreateAssetRequest createAssetRequest = mock(CreateAssetRequest.class);
//		UserLocal userLocal = mock(UserLocal.class);
//		InformationRepository informationRepository = mock(InformationRepository.class);
//		CategoryRepository categoryRepository = mock(CategoryRepository.class);
//		ModelMapper modelMapper = mock(ModelMapper.class);
//		Category categorySelected = mock(Category.class);
//		AssetServiceImpl assetServiceImpl = new AssetServiceImpl(informationRepository, adminServiceImpl, myDateUtils, categoryRepository, assignmentRepository);
//
//		when(modelMapper.map(asset, CreateAssetRequest.class)).thenReturn(createAssetRequest);
//		String userName = "test123";
//		when(userLocal.getLocalUserName()).thenReturn(userName);
//		String adminLocaltion = "HCM";
//		when(informationRepository.getLocationByUserName(userName)).thenReturn(adminLocaltion);
//		String assetPrefix = "a";
//		when(createAssetRequest.getAssetPrefix()).thenReturn(assetPrefix);
//		when(categoryRepository.findCatogeryByPrefix(assetPrefix)).thenReturn(null);
//		ResourceNotFoundException exception = Assertions.assertThrows(ResourceNotFoundException.class,
//				() -> assetServiceImpl.createNewAsset(createAssetRequest));
//		assertThat(exception.getMessage(), is("Category Not Found!!"));
//		assertThat(exception.getMessage(), is("Category Not Found!!"));
//
//	}
}