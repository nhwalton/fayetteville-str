export interface LicenseRoot {
    Keyword: string
    ExactMatch: boolean
    SearchModule: number
    FilterModule: number
    SearchMainAddress: boolean
    PlanCriteria: PlanCriteria
    PermitCriteria: PermitCriteria
    InspectionCriteria: InspectionCriteria
    CodeCaseCriteria: CodeCaseCriteria
    RequestCriteria: RequestCriteria
    BusinessLicenseCriteria: BusinessLicenseCriteria
    ProfessionalLicenseCriteria: ProfessionalLicenseCriteria
    LicenseCriteria: LicenseCriteria
    ProjectCriteria: ProjectCriteria
    PlanSortList: PlanSortList[]
    PermitSortList: PermitSortList[]
    InspectionSortList: InspectionSortList[]
    CodeCaseSortList: CodeCaseSortList[]
    RequestSortList: RequestSortList[]
    LicenseSortList: LicenseSortList[]
    ProjectSortList: ProjectSortList[]
    ExcludeCases: any
    SortOrderList: SortOrderList[]
    HiddenInspectionTypeIDs: any
    PageNumber: number
    PageSize: number
    SortBy: string
    SortAscending: boolean
}

export interface PlanCriteria {
    PlanNumber: any
    PlanTypeId: any
    PlanWorkclassId: any
    PlanStatusId: any
    ProjectName: any
    ApplyDateFrom: any
    ApplyDateTo: any
    ExpireDateFrom: any
    ExpireDateTo: any
    CompleteDateFrom: any
    CompleteDateTo: any
    Address: any
    Description: any
    SearchMainAddress: boolean
    ContactId: any
    ParcelNumber: any
    TypeId: any
    WorkClassIds: any
    ExcludeCases: any
    EnableDescriptionSearch: boolean
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface PermitCriteria {
    PermitNumber: any
    PermitTypeId: any
    PermitWorkclassId: any
    PermitStatusId: any
    ProjectName: any
    IssueDateFrom: any
    IssueDateTo: any
    Address: any
    Description: any
    ExpireDateFrom: any
    ExpireDateTo: any
    FinalDateFrom: any
    FinalDateTo: any
    ApplyDateFrom: any
    ApplyDateTo: any
    SearchMainAddress: boolean
    ContactId: any
    TypeId: any
    WorkClassIds: any
    ParcelNumber: any
    ExcludeCases: any
    EnableDescriptionSearch: boolean
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface InspectionCriteria {
    Keyword: any
    ExactMatch: boolean
    Complete: any
    InspectionNumber: any
    InspectionTypeId: any
    InspectionStatusId: any
    RequestDateFrom: any
    RequestDateTo: any
    ScheduleDateFrom: any
    ScheduleDateTo: any
    Address: any
    SearchMainAddress: boolean
    ContactId: any
    TypeId: any[]
    WorkClassIds: any[]
    ParcelNumber: any
    DisplayCodeInspections: boolean
    ExcludeCases: any[]
    ExcludeFilterModules: any[]
    HiddenInspectionTypeIDs: any
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface CodeCaseCriteria {
    CodeCaseNumber: any
    CodeCaseTypeId: any
    CodeCaseStatusId: any
    ProjectName: any
    OpenedDateFrom: any
    OpenedDateTo: any
    ClosedDateFrom: any
    ClosedDateTo: any
    Address: any
    ParcelNumber: any
    Description: any
    SearchMainAddress: boolean
    RequestId: any
    ExcludeCases: any
    ContactId: any
    EnableDescriptionSearch: boolean
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface RequestCriteria {
    RequestNumber: any
    RequestTypeId: any
    RequestStatusId: any
    ProjectName: any
    EnteredDateFrom: any
    EnteredDateTo: any
    DeadlineDateFrom: any
    DeadlineDateTo: any
    CompleteDateFrom: any
    CompleteDateTo: any
    Address: any
    ParcelNumber: any
    SearchMainAddress: boolean
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface BusinessLicenseCriteria {
    LicenseNumber: any
    LicenseTypeId: any
    LicenseClassId: any
    LicenseStatusId: any
    BusinessStatusId: any
    LicenseYear: any
    ApplicationDateFrom: any
    ApplicationDateTo: any
    IssueDateFrom: any
    IssueDateTo: any
    ExpirationDateFrom: any
    ExpirationDateTo: any
    SearchMainAddress: boolean
    CompanyTypeId: any
    CompanyName: any
    BusinessTypeId: any
    Description: any
    CompanyOpenedDateFrom: any
    CompanyOpenedDateTo: any
    CompanyClosedDateFrom: any
    CompanyClosedDateTo: any
    LastAuditDateFrom: any
    LastAuditDateTo: any
    ParcelNumber: any
    Address: any
    TaxID: any
    DBA: any
    ExcludeCases: any
    TypeId: any
    WorkClassIds: any
    ContactId: any
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface ProfessionalLicenseCriteria {
    LicenseNumber: any
    HolderFirstName: any
    HolderMiddleName: any
    HolderLastName: any
    HolderCompanyName: any
    LicenseTypeId: any
    LicenseClassId: any
    LicenseStatusId: any
    IssueDateFrom: any
    IssueDateTo: any
    ExpirationDateFrom: any
    ExpirationDateTo: any
    ApplicationDateFrom: any
    ApplicationDateTo: any
    Address: any
    MainParcel: any
    SearchMainAddress: boolean
    ExcludeCases: any
    TypeId: any
    WorkClassIds: any
    ContactId: any
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface LicenseCriteria {
    LicenseNumber: any
    LicenseTypeId: string
    LicenseClassId: string
    LicenseStatusId: string
    BusinessStatusId: string
    ApplicationDateFrom: any
    ApplicationDateTo: any
    IssueDateFrom: any
    IssueDateTo: any
    ExpirationDateFrom: any
    ExpirationDateTo: any
    SearchMainAddress: boolean
    CompanyTypeId: string
    CompanyName: any
    BusinessTypeId: string
    Description: any
    CompanyOpenedDateFrom: any
    CompanyOpenedDateTo: any
    CompanyClosedDateFrom: any
    CompanyClosedDateTo: any
    LastAuditDateFrom: any
    LastAuditDateTo: any
    ParcelNumber: any
    Address: any
    TaxID: any
    DBA: any
    ExcludeCases: any
    TypeId: any
    WorkClassIds: any
    ContactId: any
    HolderFirstName: any
    HolderMiddleName: any
    HolderLastName: any
    MainParcel: any
    EnableDescriptionSearchForBLicense: boolean
    EnableDescriptionSearchForPLicense: boolean
    PageNumber: number
    PageSize: number
    SortBy: string
    SortAscending: boolean
}

export interface ProjectCriteria {
    ProjectNumber: any
    ProjectName: any
    Address: any
    ParcelNumber: any
    StartDateFrom: any
    StartDateTo: any
    ExpectedEndDateFrom: any
    ExpectedEndDateTo: any
    CompleteDateFrom: any
    CompleteDateTo: any
    Description: any
    SearchMainAddress: boolean
    ContactId: any
    TypeId: any
    ExcludeCases: any
    EnableDescriptionSearch: boolean
    PageNumber: number
    PageSize: number
    SortBy: any
    SortAscending: boolean
}

export interface PlanSortList {
    Key: string
    Value: string
}

export interface PermitSortList {
    Key: string
    Value: string
}

export interface InspectionSortList {
    Key: string
    Value: string
}

export interface CodeCaseSortList {
    Key: string
    Value: string
}

export interface RequestSortList {
    Key: string
    Value: string
}

export interface LicenseSortList {
    Key: string
    Value: string
}

export interface ProjectSortList {
    Key: string
    Value: string
}

export interface SortOrderList {
    Key: boolean
    Value: string
}
