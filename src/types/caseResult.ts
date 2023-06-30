/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CaseRoot {
    CaseId: string
    CaseNumber: string
    CaseTypeId: any
    CaseType: string
    CaseWorkclassId: any
    CaseWorkclass: string
    CaseStatusId: any
    CaseStatus: string
    ProjectName: any
    IssueDate: any
    ApplyDate: string
    ExpireDate: string
    CompleteDate: any
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
    DBA: string
    LicenseYear: any
    CompanyName: string
    CompanyTypeName: string
    BusinessTypeName: string
    TaxID: any
    OpenedDate: any
    ClosedDate: string
    LastAuditDate: any
    HolderCompanyName: any
    HolderFirstName: string
    HolderLastName: string
    HolderMiddleName: string
    BusinessId: string
    BusinessStatus: string
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
