import React from "react";
import SearchableSelect from "../../../components/Stats/SearchableSelect";
// import LibrarySelector from "../LibrarySelector";
// import CountrySelector from "../CountrySelector";

const Selectors = ({
  selectors,
  onChange
}) => {
  const { year, borrowing_library_id, material_type, borrowing_status, fulfill_type, notfulfill_type } = selectors;

  const yearOptions = [
    { value: "", label: "All" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" }
  ];

  const materialTypeOptions = [
    { value: "", label: "All" },
    { value: 1, label: "Article" },
    { value: 2, label: "Book chapter" },
    { value: 3, label: "Thesis" },
    { value: 4, label: "Cartography / Map" },
    { value: 5, label: "Manuscript" }
  ];

  const borrowingStatusOptions = [
    { value: "", label: "All" },
    { value: 1, label: "In progress" },
    { value: 2, label: "Received" },
    { value: 3, label: "Not received" },
    { value: 4, label: "Canceled" },
    { value: 5, label: "Not received and forwarded" },
    { value: 6, label: "Fulfilled by lender but not received" },
    { value: 7, label: "Fulfilled by lender but not received and forwarded" }
  ];

  const fulfillTypeOptions = [
    { value: "", label: "All" },
    { value: 1, label: "Secure Electronic Delivery - SED" },
    { value: 2, label: "Mail" },
    { value: 3, label: "Fax" },
    { value: 4, label: "URL" },
    { value: 5, label: "Article Exchange" },
    { value: 6, label: "Other" }
  ];

  const notFulfillTypeOptions = [
    { value: "", label: "All" },
    { value: 1, label: "Not available for ILL" },
    { value: 2, label: "Not Held" },
    { value: 3, label: "Not on shelf" },
    { value: 4, label: "ILL not permitted by licence or copyright" },
    { value: 5, label: "Wrong reference" },
    { value: 6, label: "Order exceeding the maximum number of weekly requests" },
    { value: 7, label: "Other" },

  ];

  return (
    <div>
      {/* Year selector */}
      {/* <div>
        <label>Year:</label>
        <select value={year} onChange={(e) => onChange("year", e.target.value)}>
          <option value="">All</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div> */}

      <SearchableSelect 
        label="Year"
        options={yearOptions}
        onChange={(option) => onChange("year", option.value)}
        value={year}
      />

      {/* Library selector */}
      {/* <LibrarySelector 
        onLibraryChange={(option) => onChange("borrowing_library_id", option)} 
        value={borrowing_library_id}
      /> */}

      {/* Material type selector */}
      {/* <div>
        <label>Material Type:</label>
        <select value={material_type} onChange={(e) => onChange("material_type", e.target.value)}>
          <option value="">All</option>
          <option value="1">Article</option>
          <option value="2">Book chapter</option>
          <option value="3">Thesis</option>
          <option value="4">Cartography / Map</option>
          <option value="5">Manuscript</option>
        </select>
      </div> */}
      <SearchableSelect 
        label="Material type"
        options={materialTypeOptions}
        onChange={(option) => onChange("material_type", option.value)}
        value={material_type}
      />

      {/* Status selector */}
      {/* <div>
        <label>Status:</label>
        <select value={borrowing_status} onChange={(e) => onChange("borrowing_status", e.target.value)}>
          <option value="">All</option>
          <option value="1">In progress</option>
          <option value="2">Received</option>
          <option value="3">Not received</option>
          <option value="4">Canceled</option>
          <option value="5">Not received and forwarded</option>
        </select>
      </div> */}
      <SearchableSelect 
        label="Borrowing status"
        options={borrowingStatusOptions}
        onChange={(option) => onChange("borrowing_status", option.value)}
        value={borrowing_status}
      />

      {/* Conditional selector for Delivery method - appears only when status is fulfilled (2) */}
      { borrowing_status === 2 && (
        // <div>
        //   <label>Delivery Method:</label>
        //   <select value={fulfill_type} onChange={(e) => onChange("fulfill_type", e.target.value)}>
        //     <option value="">All</option>
        //     <option value="1">Secure Electronic Delivery - SED</option>
        //     <option value="2">Mail</option>
        //     <option value="3">Fax</option>
        //     <option value="4">URL</option>
        //     <option value="5">Article Exchange</option>
        //     <option value="6">Other</option>
        //   </select>
        // </div>
        <SearchableSelect 
          label="Delivery method"
          options={fulfillTypeOptions}
          onChange={(option) => onChange("fulfill_type", option.value)}
          value={fulfill_type}
        />
      )}

      {/* Conditional selector for Reason Unfulfilled - appears only when status is not fulfilled (3) */}
      { borrowing_status === 3 && (
        // <div>
        //   <label>Reason not fulfilled:</label>
        //   <select value={notfulfill_type} onChange={(e) => onChange("notfulfill_type", e.target.value)}>
        //     <option value="">All</option>
        //     <option value="1">Not available for ILL</option>
        //     <option value="2">Not held</option>
        //     <option value="3">Not on shelf</option>
        //     <option value="4">ILL not permitted by licence or copyright</option>
        //     <option value="5">Wrong reference</option>
        //     <option value="6">Order exceeding the maximum number of weekly requests</option>
        //     <option value="7">Other</option>
        //   </select>
        // </div>
        <SearchableSelect 
          label="Reason not fulfilled"
          options={notFulfillTypeOptions}
          onChange={(option) => onChange("notfulfill_type", option.value)}
          value={notfulfill_type}
        />
      )}
    </div>
  );
};

export default Selectors;