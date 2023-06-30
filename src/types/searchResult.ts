export interface SearchRoot {
    Result: Result
    Success: boolean
    ErrorMessage: string
    ValidationErrorMessage: string
    ConcurrencyErrorMessage: string
    StatusCode: number
    BrokenRules: any[]
}

export interface Result {
    EntityResults: EntityResult[]
    TotalPages: number
    PermitsFound: number
    PlansFound: number
    InspectionsFound: number
    CodeCasesFound: number
    RequestsFound: number
    BusinessLicensesFound: number
    ProfessionalLicensesFound: number
    LicensesFound: number
    ProjectsFound: number
    TotalFound: number
}

export interface EntityResult {
    CaseId: string
    CaseNumber: string
    CaseTypeId: string
    CaseType: string
    CaseWorkclassId: string
    CaseWorkclass: string
    CaseStatusId: string
    CaseStatus: string
    ProjectName: string
    IssueDate: any
    ApplyDate: string
    ExpireDate: any
    CompleteDate?: string
    FinalDate: any
    RequestDate: any
    ScheduleDate: any
    StartDate: any
    ExpectedEndDate: any
    Address: Address
    ModuleName: number
    AddressDisplay: string
    MainParcel: string
    Description: string
    DBA: any
    LicenseYear: any
    CompanyName: any
    CompanyTypeName: any
    BusinessTypeName: any
    TaxID: any
    OpenedDate: any
    ClosedDate: any
    LastAuditDate: any
    HolderCompanyName: any
    HolderFirstName: any
    HolderLastName: any
    HolderMiddleName: any
    BusinessId: any
    BusinessStatus: any
    Highlights: any
}

export interface Address {
    CountryTypeId: number
    CountryTypeName: string
    CountryName: any
    StreetTypeName: string
    PreDirection: string
    PostDirection: string
    AddressLine1: string
    AddressLine2: string
    AddressLine3: string
    AddressTypeName: string
    UnitOrSuite: string
    City: string
    StateName: string
    ProvinceName: string
    RuralRoute: string
    POBox: string
    Station: string
    CompSite: string
    ATTN: string
    PostalCode: string
    IsMain: boolean
    FullAddress: string
}
