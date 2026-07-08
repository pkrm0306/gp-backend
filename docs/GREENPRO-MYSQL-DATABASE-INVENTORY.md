# GreenPro Legacy MySQL Database Inventory

**Database:** `greenpro`
**Source:** phpMyAdmin SQL dump (schema only)
**Server:** MySQL 8.0.46
**Dump generated:** Jul 06, 2026

## Summary

| Metric | Value |
|--------|-------|
| Total tables | 64 |
| Row data in dump | **None** — structure-only export; row counts not available |
| Declared FOREIGN KEY constraints | **None** in this dump |
| Relationships | Logical via `vendor_id`, `urn_no`, `manufacturer_id`, `product_id`, etc. |

## Domain Groups

| Domain | Tables |
|--------|--------|
| **Admin & users** | `admin`, `vendors`, `vendor_users`, `team_members`, `notifications` |
| **CMS / website** | `banners`, `events`, `contacts`, `basic_details`, `newsletter_release`, `subscription_list` |
| **Reference data** | `categories`, `sectors`, `standards`, `states`, `manufacturers` |
| **Products & plants** | `products`, `product_plants`, `offline_product_plants` |
| **Documents** | `all_product_documents`, `all_renew_product_documents` |
| **Payments** | `payment_details`, `online_payment_details` |
| **Certification process** | `process_*` (registration), `process_comments`, `process_final_review` |
| **Renewal process** | `process_renew_*`, `process_renew_comments` |
| **Raw materials (section 3.x)** | `raw_materials_*` (15 tables) |

> **Note:** There are no dedicated `roles` or `permissions` tables in this schema. Access is stored on `admin.role` / `admin.access` and `vendor_users.vendor_user_type`.

## Table Index

1. [`admin`](#admin)
2. [`all_product_documents`](#all-product-documents)
3. [`all_renew_product_documents`](#all-renew-product-documents)
4. [`banners`](#banners)
5. [`basic_details`](#basic-details)
6. [`categories`](#categories)
7. [`contacts`](#contacts)
8. [`events`](#events)
9. [`manufacturers`](#manufacturers)
10. [`newsletter_release`](#newsletter-release)
11. [`notifications`](#notifications)
12. [`offline_product_plants`](#offline-product-plants)
13. [`online_payment_details`](#online-payment-details)
14. [`payment_details`](#payment-details)
15. [`process_comments`](#process-comments)
16. [`process_final_review`](#process-final-review)
17. [`process_innovation`](#process-innovation)
18. [`process_life_cycle_approach`](#process-life-cycle-approach)
19. [`process_manufacturing`](#process-manufacturing)
20. [`process_mp_energy_consumption`](#process-mp-energy-consumption)
21. [`process_mp_manufacturing_units`](#process-mp-manufacturing-units)
22. [`process_pd_measures`](#process-pd-measures)
23. [`process_product_design`](#process-product-design)
24. [`process_product_performance`](#process-product-performance)
25. [`process_product_stewardship`](#process-product-stewardship)
26. [`process_ps_stakeholder_edu_awarness`](#process-ps-stakeholder-edu-awarness)
27. [`process_renew_comments`](#process-renew-comments)
28. [`process_renew_innovation`](#process-renew-innovation)
29. [`process_renew_manufacturing`](#process-renew-manufacturing)
30. [`process_renew_mp_energy_consumption`](#process-renew-mp-energy-consumption)
31. [`process_renew_mp_manufacturing_units`](#process-renew-mp-manufacturing-units)
32. [`process_renew_product_performance`](#process-renew-product-performance)
33. [`process_renew_product_stewardship`](#process-renew-product-stewardship)
34. [`process_renew_ps_stakeholder_edu_awarness`](#process-renew-ps-stakeholder-edu-awarness)
35. [`process_renew_waste_management`](#process-renew-waste-management)
36. [`process_renew_wm_manufacturing_units`](#process-renew-wm-manufacturing-units)
37. [`process_waste_management`](#process-waste-management)
38. [`process_wm_manufacturing_units`](#process-wm-manufacturing-units)
39. [`products`](#products)
40. [`product_plants`](#product-plants)
41. [`raw_materials_additives`](#raw-materials-additives)
42. [`raw_materials_elimination_of_formaldehyde`](#raw-materials-elimination-of-formaldehyde)
43. [`raw_materials_elimination_of_prohibited_flame`](#raw-materials-elimination-of-prohibited-flame)
44. [`raw_materials_elimination_of_prohibited_flame_solvents`](#raw-materials-elimination-of-prohibited-flame-solvents)
45. [`raw_materials_elimination_of_prohibited_flame_solvents_products`](#raw-materials-elimination-of-prohibited-flame-solvents-products)
46. [`raw_materials_green_supply`](#raw-materials-green-supply)
47. [`raw_materials_hazardous`](#raw-materials-hazardous)
48. [`raw_materials_hazardous_products`](#raw-materials-hazardous-products)
49. [`raw_materials_optimization_of_raw_mix`](#raw-materials-optimization-of-raw-mix)
50. [`raw_materials_rapidly_renewable_materials`](#raw-materials-rapidly-renewable-materials)
51. [`raw_materials_recovery`](#raw-materials-recovery)
52. [`raw_materials_recycled_content`](#raw-materials-recycled-content)
53. [`raw_materials_reduce_environmental`](#raw-materials-reduce-environmental)
54. [`raw_materials_regional_materials`](#raw-materials-regional-materials)
55. [`raw_materials_utilization`](#raw-materials-utilization)
56. [`raw_materials_utilization_manufacturing_units`](#raw-materials-utilization-manufacturing-units)
57. [`raw_materials_utilization_rmc`](#raw-materials-utilization-rmc)
58. [`sectors`](#sectors)
59. [`standards`](#standards)
60. [`states`](#states)
61. [`subscription_list`](#subscription-list)
62. [`team_members`](#team-members)
63. [`vendors`](#vendors)
64. [`vendor_users`](#vendor-users)

---

## admin

| Property | Details |
|----------|--------|
| **Primary key** | `id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 13 |

### Foreign keys

_None identified._

### Nullable fields (3)

`image`, `role`, `access`

### JSON / text fields

_None._

### Blob / file path fields

- `image`

### Enum / coded values

- **`status`:** 0=Inactive,1=Active

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `id` | int | NO |
| `name` | varchar(200) | NO |
| `email` | varchar(200) | NO |
| `image` | varchar(255) | YES |
| `mobile` | varchar(100) | NO |
| `username` | varchar(100) | NO |
| `password` | varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | NO |
| `role` | varchar(20) | YES |
| `access` | varchar(50) | YES |
| `status` | int | NO |
| `admin_gst_no` | varchar(255) | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## all_product_documents

| Property | Details |
|----------|--------|
| **Primary key** | `product_document_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- form_primary_id → `parent form row (polymorphic)` (logical, not enforced)

### Nullable fields (2)

`eoi_no`, `document_form_subsection`

### JSON / text fields

_None._

### Blob / file path fields

- `document_form`
- `document_form_subsection`
- `document_name`
- `document_original_name`
- `document_link`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_document_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `eoi_no` | varchar(20) | YES |
| `document_form` | varchar(100) | NO |
| `document_form_subsection` | varchar(255) | YES |
| `form_primary_id` | int | NO |
| `document_name` | varchar(255) | NO |
| `document_original_name` | varchar(255) | NO |
| `document_link` | varchar(500) | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## all_renew_product_documents

| Property | Details |
|----------|--------|
| **Primary key** | `product_document_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- form_primary_id → `parent form row (polymorphic)` (logical, not enforced)

### Nullable fields (2)

`eoi_no`, `document_form_subsection`

### JSON / text fields

_None._

### Blob / file path fields

- `document_form`
- `document_form_subsection`
- `document_name`
- `document_original_name`
- `document_link`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_document_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `eoi_no` | varchar(20) | YES |
| `document_form` | varchar(100) | NO |
| `document_form_subsection` | varchar(255) | YES |
| `form_primary_id` | int | NO |
| `document_name` | varchar(255) | NO |
| `document_original_name` | varchar(255) | NO |
| `document_link` | varchar(500) | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## banners

| Property | Details |
|----------|--------|
| **Primary key** | `banner_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_None identified._

### Nullable fields (2)

`banner_image`, `banner_url`

### JSON / text fields

- `banner_description`

### Blob / file path fields

- `banner_heading`
- `banner_description`
- `banner_image`
- `banner_url`

### Enum / coded values

- **`banner_status`:** 0=Inactive,1=Active

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `banner_id` | int | NO |
| `banner_heading` | varchar(200) | NO |
| `banner_description` | text | NO |
| `banner_image` | varchar(200) | YES |
| `banner_url` | varchar(200) | YES |
| `banner_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## basic_details

| Property | Details |
|----------|--------|
| **Primary key** | `basic_details_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_None identified._

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `address`

### Blob / file path fields

- `linkedin_url`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `basic_details_id` | int | NO |
| `facebook_url` | varchar(255) | NO |
| `twitter_url` | varchar(255) | NO |
| `linkedin_url` | varchar(255) | NO |
| `youtube_url` | varchar(255) | NO |
| `address` | text | NO |
| `contact_no1` | varchar(20) | NO |
| `contact_no2` | varchar(20) | NO |

---

## categories

| Property | Details |
|----------|--------|
| **Primary key** | `category_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 7 |

### Foreign keys

_None identified._

### Nullable fields (2)

`category_image`, `category_raw_material_forms`

### JSON / text fields

_None._

### Blob / file path fields

- `category_image`

### Enum / coded values

- **`category_status`:** 0=Inactive,1=Active,2=Deleted

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `category_id` | int | NO |
| `category_name` | varchar(255) | NO |
| `category_image` | varchar(255) | YES |
| `category_raw_material_forms` | varchar(50) | YES |
| `category_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## contacts

| Property | Details |
|----------|--------|
| **Primary key** | `contact_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 9 |

### Foreign keys

_None identified._

### Nullable fields (1)

`contact_subject`

### JSON / text fields

- `contact_message`

### Blob / file path fields

_None._

### Enum / coded values

- **`contact_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `contact_id` | int | NO |
| `contact_name` | varchar(200) | NO |
| `contact_email` | varchar(255) | NO |
| `contact_phone` | varchar(20) | NO |
| `contact_subject` | varchar(100) | YES |
| `contact_message` | text | NO |
| `contact_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## events

| Property | Details |
|----------|--------|
| **Primary key** | `event_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 15 |

### Foreign keys

_None identified._

### Nullable fields (6)

`event_start_time`, `event_end_time`, `contact_person_name`, `contact_person_designation`, `contact_person_email`, `contact_person_phone`

### JSON / text fields

- `event_description`

### Blob / file path fields

- `event_image`

### Enum / coded values

- **`event_status`:** 0=Inactive,1=Active,2=Deleted

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `event_id` | int | NO |
| `event_name` | varchar(255) | NO |
| `event_image` | varchar(255) | NO |
| `event_date` | date | NO |
| `event_start_time` | varchar(20) | YES |
| `event_end_time` | varchar(20) | YES |
| `event_location` | varchar(100) | NO |
| `event_description` | text | NO |
| `contact_person_name` | varchar(200) | YES |
| `contact_person_designation` | varchar(100) | YES |
| `contact_person_email` | varchar(255) | YES |
| `contact_person_phone` | varchar(20) | YES |
| `event_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## manufacturers

| Property | Details |
|----------|--------|
| **Primary key** | `manufacturer_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 9 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- gp_internal_id → `gp_internals` (logical, not enforced)

### Nullable fields (3)

`manufacturer_image`, `manufacturer_initial`, `validity`

### JSON / text fields

_None._

### Blob / file path fields

- `manufacturer_image`

### Enum / coded values

- **`manufacturer_status`:** 0=Deleted,1=Active,2=Unverified

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `manufacturer_id` | int | NO |
| `gp_internal_id` | varchar(20) | NO |
| `manufacturer_name` | varchar(255) | NO |
| `manufacturer_image` | varchar(255) | YES |
| `manufacturer_initial` | varchar(10) | YES |
| `validity` | varchar(20) | YES |
| `manufacturer_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## newsletter_release

| Property | Details |
|----------|--------|
| **Primary key** | `newsletter_release_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 6 |

### Foreign keys

_None identified._

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

_None._

### Blob / file path fields

- `newsletter_release_file`

### Enum / coded values

- **`newsletter_release_status`:** 0=Inactive,1=Active

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `newsletter_release_id` | int | NO |
| `newsletter_release_name` | varchar(255) | NO |
| `newsletter_release_file` | varchar(255) | NO |
| `newsletter_release_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## notifications

| Property | Details |
|----------|--------|
| **Primary key** | `id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 9 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- user_id → `admin / vendor_users (context-dependent)` (logical, not enforced)

### Nullable fields (6)

`title`, `content`, `notify_type`, `user_id`, `updated_at`, `deleted_at`

### JSON / text fields

- `content`
- `notify_type`

### Blob / file path fields

_None._

### Enum / coded values

- **`notify_type`:** C=>company, AS=>assessor, A=>admin,F=>facilitator
- **`seen`:** 0=>unseen, 1=>seen

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `id` | int | NO |
| `title` | varchar(100) | YES |
| `content` | text | YES |
| `notify_type` | tinytext | YES |
| `user_id` | int | YES |
| `seen` | int | NO |
| `created_at` | timestamp | NO |
| `updated_at` | timestamp NULL | YES |
| `deleted_at` | timestamp NULL | YES |

---

## offline_product_plants

| Property | Details |
|----------|--------|
| **Primary key** | `product_plant_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- product_id → `products` (logical, not enforced)
- vendor_id → `vendors` (logical, not enforced)
- category_id → `categories` (logical, not enforced)
- manufacturer_id → `manufacturers` (logical, not enforced)

### Nullable fields (1)

`state`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_plant_id` | int | NO |
| `product_id` | int | NO |
| `vendor_id` | int | NO |
| `category_id` | int | NO |
| `manufacturer_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `eoi_no` | varchar(20) | NO |
| `plant_name` | varchar(100) | NO |
| `plant_location` | varchar(255) | NO |
| `state` | varchar(100) | YES |
| `plant_status` | tinyint | NO |
| `created_date` | datetime | NO |

---

## online_payment_details

| Property | Details |
|----------|--------|
| **Primary key** | `online_payment_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- payment_id → `payment_details` (logical, not enforced)
- vendor_id → `vendors` (logical, not enforced)
- transaction_id → `transactions` (logical, not enforced)

### Nullable fields (4)

`transaction_id`, `total_amount`, `transaction_amount`, `payment_mode`

### JSON / text fields

- `pg_json_response`

### Blob / file path fields

_None._

### Enum / coded values

- **`online_payment_status`:** 1=Completed,2=Cancelled,3=Failed,4=Unauthorised

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `online_payment_id` | int | NO |
| `payment_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `transaction_id` | varchar(20) | YES |
| `pg_ref_no` | varchar(20) | NO |
| `total_amount` | decimal(16,2) | YES |
| `transaction_amount` | decimal(16,2) | YES |
| `transaction_date` | datetime | NO |
| `payment_mode` | varchar(20) | YES |
| `online_payment_status` | tinyint | NO |
| `pg_json_response` | text | NO |

---

## payment_details

| Property | Details |
|----------|--------|
| **Primary key** | `payment_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 21 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- online_payment_id → `online_payment_details` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (vendor_id,urn_no) USING BTREE
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (7)

`proposal_file`, `payment_mode`, `payment_reference_no`, `payment_cheque_date`, `cheque_or_dd_file`, `tds_file`, `products_to_be_certified`

### JSON / text fields

- `products_to_be_certified`

### Blob / file path fields

- `proposal_file`
- `cheque_or_dd_file`
- `tds_file`

### Enum / coded values

- **`payment_type`:** 'registration','certification','renew'
- **`payment_mode`:** 'online','cheque_or_dd','neft_or_rtgs'
- **`payment_status`:** 0=Created,1=Pending,2=Completed,3=Cancelled

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `payment_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `quote_amount` | decimal(10,2) | NO |
| `quote_gst_amount` | decimal(10,2) | NO |
| `quote_tds_amount` | int | NO |
| `quote_total` | decimal(10,2) | NO |
| `proposal_file` | varchar(255) | YES |
| `admin_gst_no` | varchar(255) | NO |
| `vendor_gst_no` | varchar(255) | NO |
| `payment_type` | enum('registration','certification','renew') | NO |
| `payment_mode` | enum('online','cheque_or_dd','neft_or_rtgs') | YES |
| `online_payment_id` | int | NO |
| `payment_reference_no` | varchar(50) | YES |
| `payment_cheque_date` | date | YES |
| `cheque_or_dd_file` | varchar(255) | YES |
| `tds_file` | varchar(255) | YES |
| `products_to_be_certified` | longtext | YES |
| `payment_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_comments

| Property | Details |
|----------|--------|
| **Primary key** | `process_comments_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 26 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (22)

`product_design`, `product_performance`, `manfacturing_process`, `waste_management`, `life_cycle_approach`, `product_stewardship`, `product_innovation`, `raw_materials_3_1`, `raw_materials_3_2`, `raw_materials_3_3`, `raw_materials_3_4`, `raw_materials_3_5`, `raw_materials_3_6`, `raw_materials_3_7`, `raw_materials_3_8`, `raw_materials_3_9`, `raw_materials_3_10`, `raw_materials_3_11`, `raw_materials_3_12`, `raw_materials_3_13`, `raw_materials_3_14`, `raw_materials_3_15`

### JSON / text fields

- `product_design`
- `product_performance`
- `manfacturing_process`
- `waste_management`
- `life_cycle_approach`
- `product_stewardship`
- `product_innovation`
- `raw_materials_3_1`
- `raw_materials_3_2`
- `raw_materials_3_3`
- `raw_materials_3_4`
- `raw_materials_3_5`
- `raw_materials_3_6`
- `raw_materials_3_7`
- `raw_materials_3_8`
- `raw_materials_3_9`
- `raw_materials_3_10`
- `raw_materials_3_11`
- `raw_materials_3_12`
- `raw_materials_3_13`
- `raw_materials_3_14`
- `raw_materials_3_15`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_comments_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `product_design` | text | YES |
| `product_performance` | text | YES |
| `manfacturing_process` | text | YES |
| `waste_management` | text | YES |
| `life_cycle_approach` | text | YES |
| `product_stewardship` | text | YES |
| `product_innovation` | text | YES |
| `raw_materials_3_1` | text | YES |
| `raw_materials_3_2` | text | YES |
| `raw_materials_3_3` | text | YES |
| `raw_materials_3_4` | text | YES |
| `raw_materials_3_5` | text | YES |
| `raw_materials_3_6` | text | YES |
| `raw_materials_3_7` | text | YES |
| `raw_materials_3_8` | text | YES |
| `raw_materials_3_9` | text | YES |
| `raw_materials_3_10` | text | YES |
| `raw_materials_3_11` | text | YES |
| `raw_materials_3_12` | text | YES |
| `raw_materials_3_13` | text | YES |
| `raw_materials_3_14` | text | YES |
| `raw_materials_3_15` | text | YES |
| `updated_date` | date | NO |

---

## process_final_review

| Property | Details |
|----------|--------|
| **Primary key** | `process_final_review_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 93 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (88)

`final_review_product_design`, `final_review_product_performance`, `final_review_manfacturing_process`, `final_review_waste_management`, `final_review_life_cycle_approach`, `final_review_product_stewardship`, `final_review_product_innovation`, `final_review_raw_materials_3_1`, `final_review_raw_materials_3_2`, `final_review_raw_materials_3_3`, `final_review_raw_materials_3_4`, `final_review_raw_materials_3_5`, `final_review_raw_materials_3_6`, `final_review_raw_materials_3_7`, `final_review_raw_materials_3_8`, `final_review_raw_materials_3_9`, `final_review_raw_materials_3_10`, `final_review_raw_materials_3_11`, `final_review_raw_materials_3_12`, `final_review_raw_materials_3_13`, `final_review_raw_materials_3_14`, `final_review_raw_materials_3_15`, `credits_product_design`, `credits_product_performance`, `credits_manfacturing_process`, `credits_waste_management`, `credits_life_cycle_approach`, `credits_product_stewardship`, `credits_product_innovation`, `credits_raw_materials_3_1`, `credits_raw_materials_3_2`, `credits_raw_materials_3_3`, `credits_raw_materials_3_4`, `credits_raw_materials_3_5`, `credits_raw_materials_3_6`, `credits_raw_materials_3_7`, `credits_raw_materials_3_8`, `credits_raw_materials_3_9`, `credits_raw_materials_3_10`, `credits_raw_materials_3_11`, `credits_raw_materials_3_12`, `credits_raw_materials_3_13`, `credits_raw_materials_3_14`, `credits_raw_materials_3_15`, `max_credits_product_design`, `max_credits_product_performance`, `max_credits_manfacturing_process`, `max_credits_waste_management`, `max_credits_life_cycle_approach`, `max_credits_product_stewardship`, `max_credits_product_innovation`, `max_credits_raw_materials_3_1`, `max_credits_raw_materials_3_2`, `max_credits_raw_materials_3_3`, `max_credits_raw_materials_3_4`, `max_credits_raw_materials_3_5`, `max_credits_raw_materials_3_6`, `max_credits_raw_materials_3_7`, `max_credits_raw_materials_3_8`, `max_credits_raw_materials_3_9`, `max_credits_raw_materials_3_10`, `max_credits_raw_materials_3_11`, `max_credits_raw_materials_3_12`, `max_credits_raw_materials_3_13`, `max_credits_raw_materials_3_14`, `max_credits_raw_materials_3_15`, `technical_advise_product_design`, `technical_advise_product_performance`, `technical_advise_manfacturing_process`, `technical_advise_waste_management`, `technical_advise_life_cycle_approach`, `technical_advise_product_stewardship`, `technical_advise_product_innovation`, `technical_advise_raw_materials_3_1`, `technical_advise_raw_materials_3_2`, `technical_advise_raw_materials_3_3`, `technical_advise_raw_materials_3_4`, `technical_advise_raw_materials_3_5`, `technical_advise_raw_materials_3_6`, `technical_advise_raw_materials_3_7`, `technical_advise_raw_materials_3_8`, `technical_advise_raw_materials_3_9`, `technical_advise_raw_materials_3_10`, `technical_advise_raw_materials_3_11`, `technical_advise_raw_materials_3_12`, `technical_advise_raw_materials_3_13`, `technical_advise_raw_materials_3_14`, `technical_advise_raw_materials_3_15`

### JSON / text fields

- `final_review_product_design`
- `final_review_product_performance`
- `final_review_manfacturing_process`
- `final_review_waste_management`
- `final_review_life_cycle_approach`
- `final_review_product_stewardship`
- `final_review_product_innovation`
- `final_review_raw_materials_3_1`
- `final_review_raw_materials_3_2`
- `final_review_raw_materials_3_3`
- `final_review_raw_materials_3_4`
- `final_review_raw_materials_3_5`
- `final_review_raw_materials_3_6`
- `final_review_raw_materials_3_7`
- `final_review_raw_materials_3_8`
- `final_review_raw_materials_3_9`
- `final_review_raw_materials_3_10`
- `final_review_raw_materials_3_11`
- `final_review_raw_materials_3_12`
- `final_review_raw_materials_3_13`
- `final_review_raw_materials_3_14`
- `final_review_raw_materials_3_15`
- `credits_product_design`
- `credits_product_performance`
- `credits_manfacturing_process`
- `credits_waste_management`
- `credits_life_cycle_approach`
- `credits_product_stewardship`
- `credits_product_innovation`
- `credits_raw_materials_3_1`
- `credits_raw_materials_3_2`
- `credits_raw_materials_3_3`
- `credits_raw_materials_3_4`
- `credits_raw_materials_3_5`
- `credits_raw_materials_3_6`
- `credits_raw_materials_3_7`
- `credits_raw_materials_3_8`
- `credits_raw_materials_3_9`
- `credits_raw_materials_3_10`
- `credits_raw_materials_3_11`
- `credits_raw_materials_3_12`
- `credits_raw_materials_3_13`
- `credits_raw_materials_3_14`
- `credits_raw_materials_3_15`
- `max_credits_product_design`
- `max_credits_product_performance`
- `max_credits_manfacturing_process`
- `max_credits_waste_management`
- `max_credits_life_cycle_approach`
- `max_credits_product_stewardship`
- `max_credits_product_innovation`
- `max_credits_raw_materials_3_1`
- `max_credits_raw_materials_3_2`
- `max_credits_raw_materials_3_3`
- `max_credits_raw_materials_3_4`
- `max_credits_raw_materials_3_5`
- `max_credits_raw_materials_3_6`
- `max_credits_raw_materials_3_7`
- `max_credits_raw_materials_3_8`
- `max_credits_raw_materials_3_9`
- `max_credits_raw_materials_3_10`
- `max_credits_raw_materials_3_11`
- `max_credits_raw_materials_3_12`
- `max_credits_raw_materials_3_13`
- `max_credits_raw_materials_3_14`
- `max_credits_raw_materials_3_15`
- `technical_advise_product_design`
- `technical_advise_product_performance`
- `technical_advise_manfacturing_process`
- `technical_advise_waste_management`
- `technical_advise_life_cycle_approach`
- `technical_advise_product_stewardship`
- `technical_advise_product_innovation`
- `technical_advise_raw_materials_3_1`
- `technical_advise_raw_materials_3_2`
- `technical_advise_raw_materials_3_3`
- `technical_advise_raw_materials_3_4`
- `technical_advise_raw_materials_3_5`
- `technical_advise_raw_materials_3_6`
- `technical_advise_raw_materials_3_7`
- `technical_advise_raw_materials_3_8`
- `technical_advise_raw_materials_3_9`
- `technical_advise_raw_materials_3_10`
- `technical_advise_raw_materials_3_11`
- `technical_advise_raw_materials_3_12`
- `technical_advise_raw_materials_3_13`
- `technical_advise_raw_materials_3_14`
- `technical_advise_raw_materials_3_15`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_final_review_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `final_review_product_design` | text | YES |
| `final_review_product_performance` | text | YES |
| `final_review_manfacturing_process` | text | YES |
| `final_review_waste_management` | text | YES |
| `final_review_life_cycle_approach` | text | YES |
| `final_review_product_stewardship` | text | YES |
| `final_review_product_innovation` | text | YES |
| `final_review_raw_materials_3_1` | text | YES |
| `final_review_raw_materials_3_2` | text | YES |
| `final_review_raw_materials_3_3` | text | YES |
| `final_review_raw_materials_3_4` | text | YES |
| `final_review_raw_materials_3_5` | text | YES |
| `final_review_raw_materials_3_6` | text | YES |
| `final_review_raw_materials_3_7` | text | YES |
| `final_review_raw_materials_3_8` | text | YES |
| `final_review_raw_materials_3_9` | text | YES |
| `final_review_raw_materials_3_10` | text | YES |
| `final_review_raw_materials_3_11` | text | YES |
| `final_review_raw_materials_3_12` | text | YES |
| `final_review_raw_materials_3_13` | text | YES |
| `final_review_raw_materials_3_14` | text | YES |
| `final_review_raw_materials_3_15` | text | YES |
| `credits_product_design` | text | YES |
| `credits_product_performance` | text | YES |
| `credits_manfacturing_process` | text | YES |
| `credits_waste_management` | text | YES |
| `credits_life_cycle_approach` | text | YES |
| `credits_product_stewardship` | text | YES |
| `credits_product_innovation` | text | YES |
| `credits_raw_materials_3_1` | text | YES |
| `credits_raw_materials_3_2` | text | YES |
| `credits_raw_materials_3_3` | text | YES |
| `credits_raw_materials_3_4` | text | YES |
| `credits_raw_materials_3_5` | text | YES |
| `credits_raw_materials_3_6` | text | YES |
| `credits_raw_materials_3_7` | text | YES |
| `credits_raw_materials_3_8` | text | YES |
| `credits_raw_materials_3_9` | text | YES |
| `credits_raw_materials_3_10` | text | YES |
| `credits_raw_materials_3_11` | text | YES |
| `credits_raw_materials_3_12` | text | YES |
| `credits_raw_materials_3_13` | text | YES |
| `credits_raw_materials_3_14` | text | YES |
| `credits_raw_materials_3_15` | text | YES |
| `max_credits_product_design` | text | YES |
| `max_credits_product_performance` | text | YES |
| `max_credits_manfacturing_process` | text | YES |
| `max_credits_waste_management` | text | YES |
| `max_credits_life_cycle_approach` | text | YES |
| `max_credits_product_stewardship` | text | YES |
| `max_credits_product_innovation` | text | YES |
| `max_credits_raw_materials_3_1` | text | YES |
| `max_credits_raw_materials_3_2` | text | YES |
| `max_credits_raw_materials_3_3` | text | YES |
| `max_credits_raw_materials_3_4` | text | YES |
| `max_credits_raw_materials_3_5` | text | YES |
| `max_credits_raw_materials_3_6` | text | YES |
| `max_credits_raw_materials_3_7` | text | YES |
| `max_credits_raw_materials_3_8` | text | YES |
| `max_credits_raw_materials_3_9` | text | YES |
| `max_credits_raw_materials_3_10` | text | YES |
| `max_credits_raw_materials_3_11` | text | YES |
| `max_credits_raw_materials_3_12` | text | YES |
| `max_credits_raw_materials_3_13` | text | YES |
| `max_credits_raw_materials_3_14` | text | YES |
| `max_credits_raw_materials_3_15` | text | YES |
| `technical_advise_product_design` | text | YES |
| `technical_advise_product_performance` | text | YES |
| `technical_advise_manfacturing_process` | text | YES |
| `technical_advise_waste_management` | text | YES |
| `technical_advise_life_cycle_approach` | text | YES |
| `technical_advise_product_stewardship` | text | YES |
| `technical_advise_product_innovation` | text | YES |
| `technical_advise_raw_materials_3_1` | text | YES |
| `technical_advise_raw_materials_3_2` | text | YES |
| `technical_advise_raw_materials_3_3` | text | YES |
| `technical_advise_raw_materials_3_4` | text | YES |
| `technical_advise_raw_materials_3_5` | text | YES |
| `technical_advise_raw_materials_3_6` | text | YES |
| `technical_advise_raw_materials_3_7` | text | YES |
| `technical_advise_raw_materials_3_8` | text | YES |
| `technical_advise_raw_materials_3_9` | text | YES |
| `technical_advise_raw_materials_3_10` | text | YES |
| `technical_advise_raw_materials_3_11` | text | YES |
| `technical_advise_raw_materials_3_12` | text | YES |
| `technical_advise_raw_materials_3_13` | text | YES |
| `technical_advise_raw_materials_3_14` | text | YES |
| `technical_advise_raw_materials_3_15` | text | YES |
| `status` | int | NO |
| `updated_date` | date | NO |

---

## process_innovation

| Property | Details |
|----------|--------|
| **Primary key** | `process_innovation_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (urn_no,vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (1)

`innovation_implementation_details`

### JSON / text fields

- `innovation_implementation_details`

### Blob / file path fields

_None._

### Enum / coded values

- **`process_innovation_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_innovation_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `innovation_implementation_details` | text | YES |
| `innovation_implementation_documents` | tinyint | NO |
| `process_innovation_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_life_cycle_approach

| Property | Details |
|----------|--------|
| **Primary key** | `process_life_cycle_approach_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 9 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (urn_no,vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (3)

`life_cycle_assesment_reports`, `life_cycle_implementation_details`, `life_cycle_implementation_documents`

### JSON / text fields

- `life_cycle_implementation_details`

### Blob / file path fields

_None._

### Enum / coded values

- **`process_life_cycle_approach_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_life_cycle_approach_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `life_cycle_assesment_reports` | tinyint | YES |
| `life_cycle_implementation_details` | text | YES |
| `life_cycle_implementation_documents` | tinyint | YES |
| `process_life_cycle_approach_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_manufacturing

| Property | Details |
|----------|--------|
| **Primary key** | `process_manufacturing_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (4)

`portable_water_demand`, `rain_water_harvesting`, `beyond_the_fence_initiatives`, `total_energy_consumption`

### JSON / text fields

- `portable_water_demand`
- `rain_water_harvesting`
- `beyond_the_fence_initiatives`

### Blob / file path fields

_None._

### Enum / coded values

- **`process_manufacturing_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_manufacturing_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `energy_conservation_supporting_documents` | tinyint | NO |
| `portable_water_demand` | text | YES |
| `rain_water_harvesting` | text | YES |
| `beyond_the_fence_initiatives` | text | YES |
| `total_energy_consumption` | int | YES |
| `energy_consumption_documents` | tinyint | NO |
| `process_manufacturing_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_mp_energy_consumption

| Property | Details |
|----------|--------|
| **Primary key** | `process_mp_energy_consumption_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- process_manufacturing_id → `process_manufacturing` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (2)

`energy_conservation_project`, `annual_energy_savings`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_mp_energy_consumption_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `process_manufacturing_id` | int | NO |
| `energy_conservation_project` | varchar(255) | YES |
| `annual_energy_savings` | varchar(50) | YES |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_mp_manufacturing_units

| Property | Details |
|----------|--------|
| **Primary key** | `process_mp_manufacturing_unit_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 66 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (62)

`unit_name`, `renewable_energy_utilization`, `ecd_year1`, `ecd_year2`, `ecd_year3`, `ecd_production_unit`, `ecd_production_year1`, `ecd_production_year2`, `ecd_production_year3`, `ecd_electric_unit`, `ecd_electric_year1`, `ecd_electric_year2`, `ecd_electric_year3`, `ecd_thermal_unit_fuel1`, `ecd_thermal_unit_fuel3`, `ecd_thermal_fuel1_year1`, `ecd_thermal_fuel1_year2`, `ecd_thermal_fuel1_year3`, `ecd_thermal_unit_fuel2`, `ecd_thermal_fuel2_year1`, `ecd_thermal_fuel2_year2`, `ecd_thermal_fuel2_year3`, `ecd_thermal_fuel3_year1`, `ecd_thermal_fuel3_year2`, `ecd_thermal_fuel3_year3`, `ecd_calorific_fuel1_year1`, `ecd_calorific_fuel1_year2`, `ecd_calorific_fuel1_year3`, `ecd_calorific_fuel2_year1`, `ecd_calorific_fuel2_year2`, `ecd_calorific_fuel2_year3`, `ecd_calorific_fuel3_year1`, `ecd_calorific_fuel3_year2`, `ecd_calorific_fuel3_year3`, `ecd_textarea_new_units`, `wcd_year1`, `wcd_year2`, `wcd_year3`, `wcd_production_unit`, `wcd_water_unit`, `wcd_production_year1`, `wcd_production_year2`, `wcd_production_year3`, `wcd_water_year1`, `wcd_water_year2`, `wcd_water_year3`, `re_year`, `re_solar_photovoltaic`, `re_wind`, `re_biomass`, `re_solar_thermal`, `re_others_unit`, `re_others`, `process_mp_manufacturing_unit_status`, `calculate_bulk_sec`, `calculate_bulk_swc`, `calculate_bulk_sec_multipled`, `calculate_bulk_swc_multipled`, `measures_implemented_mp_units`, `details_of_rain_water_harvesting_mp_units`, `created_date`, `updated_date`

### JSON / text fields

- `ecd_textarea_new_units`
- `calculate_bulk_sec_multipled`
- `calculate_bulk_swc_multipled`
- `measures_implemented_mp_units`
- `details_of_rain_water_harvesting_mp_units`

### Blob / file path fields

_None._

### Enum / coded values

- **`renewable_energy_utilization`:** 'yes','no'
- **`process_mp_manufacturing_unit_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_mp_manufacturing_unit_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `unit_name` | varchar(255) | YES |
| `renewable_energy_utilization` | enum('yes','no') | YES |
| `ecd_year1` | varchar(8) | YES |
| `ecd_year2` | varchar(8) | YES |
| `ecd_year3` | varchar(8) | YES |
| `ecd_production_unit` | varchar(8) | YES |
| `ecd_production_year1` | decimal(10,2) | YES |
| `ecd_production_year2` | decimal(10,2) | YES |
| `ecd_production_year3` | decimal(10,2) | YES |
| `ecd_electric_unit` | varchar(8) | YES |
| `ecd_electric_year1` | decimal(10,2) | YES |
| `ecd_electric_year2` | decimal(10,2) | YES |
| `ecd_electric_year3` | decimal(10,2) | YES |
| `ecd_thermal_unit_fuel1` | varchar(8) | YES |
| `ecd_thermal_unit_fuel3` | varchar(8) | YES |
| `ecd_thermal_fuel1_year1` | decimal(10,2) | YES |
| `ecd_thermal_fuel1_year2` | decimal(10,2) | YES |
| `ecd_thermal_fuel1_year3` | decimal(10,2) | YES |
| `ecd_thermal_unit_fuel2` | varchar(8) | YES |
| `ecd_thermal_fuel2_year1` | decimal(10,2) | YES |
| `ecd_thermal_fuel2_year2` | decimal(10,2) | YES |
| `ecd_thermal_fuel2_year3` | decimal(10,2) | YES |
| `ecd_thermal_fuel3_year1` | decimal(10,2) | YES |
| `ecd_thermal_fuel3_year2` | decimal(10,2) | YES |
| `ecd_thermal_fuel3_year3` | decimal(10,2) | YES |
| `ecd_calorific_fuel1_year1` | decimal(10,2) | YES |
| `ecd_calorific_fuel1_year2` | decimal(10,2) | YES |
| `ecd_calorific_fuel1_year3` | decimal(10,2) | YES |
| `ecd_calorific_fuel2_year1` | decimal(10,2) | YES |
| `ecd_calorific_fuel2_year2` | decimal(10,2) | YES |
| `ecd_calorific_fuel2_year3` | decimal(10,2) | YES |
| `ecd_calorific_fuel3_year1` | decimal(10,2) | YES |
| `ecd_calorific_fuel3_year2` | decimal(10,2) | YES |
| `ecd_calorific_fuel3_year3` | decimal(10,2) | YES |
| `ecd_textarea_new_units` | text | YES |
| `wcd_year1` | varchar(8) | YES |
| `wcd_year2` | varchar(8) | YES |
| `wcd_year3` | varchar(8) | YES |
| `wcd_production_unit` | varchar(8) | YES |
| `wcd_water_unit` | varchar(8) | YES |
| `wcd_production_year1` | decimal(10,2) | YES |
| `wcd_production_year2` | decimal(10,2) | YES |
| `wcd_production_year3` | decimal(10,2) | YES |
| `wcd_water_year1` | decimal(10,2) | YES |
| `wcd_water_year2` | decimal(10,2) | YES |
| `wcd_water_year3` | decimal(10,2) | YES |
| `re_year` | varchar(8) | YES |
| `re_solar_photovoltaic` | decimal(10,2) | YES |
| `re_wind` | decimal(10,2) | YES |
| `re_biomass` | decimal(10,2) | YES |
| `re_solar_thermal` | decimal(10,2) | YES |
| `re_others_unit` | varchar(8) | YES |
| `re_others` | decimal(10,2) | YES |
| `offsite_renewable_power` | int | NO |
| `process_mp_manufacturing_unit_status` | tinyint | YES |
| `calculate_bulk_sec` | int | YES |
| `calculate_bulk_swc` | int | YES |
| `calculate_bulk_sec_multipled` | text | YES |
| `calculate_bulk_swc_multipled` | text | YES |
| `measures_implemented_mp_units` | text | YES |
| `details_of_rain_water_harvesting_mp_units` | text | YES |
| `created_date` | datetime | YES |
| `updated_date` | datetime | YES |

---

## process_pd_measures

| Property | Details |
|----------|--------|
| **Primary key** | `product_design_measure_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- product_design_id → `product_designs` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (vendor_id,urn_no) USING BTREE
- KEY product_design_id (product_design_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (2)

`measures`, `benefits`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_design_measure_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `product_design_id` | int | NO |
| `measures` | varchar(255) | YES |
| `benefits` | varchar(255) | YES |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_product_design

| Property | Details |
|----------|--------|
| **Primary key** | `product_design_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 9 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (vendor_id,urn_no) USING BTREE
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (1)

`statergies`

### JSON / text fields

- `statergies`

### Blob / file path fields

_None._

### Enum / coded values

- **`product_design_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_design_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `eco_vision_upload` | tinyint | NO |
| `statergies` | text | YES |
| `product_design_supporting_document` | tinyint | NO |
| `product_design_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_product_performance

| Property | Details |
|----------|--------|
| **Primary key** | `process_product_performance_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 11 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (vendor_id,urn_no) USING BTREE
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

_None._

### Blob / file path fields

- `test_report_file_name`

### Enum / coded values

- **`product_performance_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_product_performance_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `eoi_no` | varchar(20) | NO |
| `product_name` | varchar(255) | NO |
| `test_report_file_name` | varchar(255) | NO |
| `test_report_files` | tinyint | NO |
| `renewal_type` | int | NO |
| `product_performance_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_product_stewardship

| Property | Details |
|----------|--------|
| **Primary key** | `process_product_stewardship_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (urn_no,vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (3)

`quality_management_details`, `epr_implemented_details`, `epr_green_packaging_details`

### JSON / text fields

- `quality_management_details`
- `epr_implemented_details`
- `epr_green_packaging_details`

### Blob / file path fields

_None._

### Enum / coded values

- **`product_stewardship_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_product_stewardship_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `sea_supporting_documents` | tinyint | NO |
| `quality_management_details` | text | YES |
| `qm_supporting_documents` | tinyint | NO |
| `epr_implemented_details` | text | YES |
| `epr_green_packaging_details` | text | YES |
| `epr_supporting_documents` | tinyint | NO |
| `product_stewardship_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_ps_stakeholder_edu_awarness

| Property | Details |
|----------|--------|
| **Primary key** | `process_ps_stakeholder_edu_awerness_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 10 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- process_product_stewardship_id → `process_product_stewardships` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (urn_no,vendor_id)
- KEY process_product_stewardship_id (process_product_stewardship_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (1)

`sea_no_of_programs`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

- **`product_stewardship_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_ps_stakeholder_edu_awerness_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `process_product_stewardship_id` | int | NO |
| `sea_program_details` | varchar(255) | NO |
| `sea_no_of_programs` | varchar(50) | YES |
| `sea_supporting_documents` | tinyint | NO |
| `product_stewardship_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_comments

| Property | Details |
|----------|--------|
| **Primary key** | `process_comments_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 26 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (22)

`product_design`, `product_performance`, `manfacturing_process`, `waste_management`, `life_cycle_approach`, `product_stewardship`, `product_innovation`, `raw_materials_3_1`, `raw_materials_3_2`, `raw_materials_3_3`, `raw_materials_3_4`, `raw_materials_3_5`, `raw_materials_3_6`, `raw_materials_3_7`, `raw_materials_3_8`, `raw_materials_3_9`, `raw_materials_3_10`, `raw_materials_3_11`, `raw_materials_3_12`, `raw_materials_3_13`, `raw_materials_3_14`, `raw_materials_3_15`

### JSON / text fields

- `product_design`
- `product_performance`
- `manfacturing_process`
- `waste_management`
- `life_cycle_approach`
- `product_stewardship`
- `product_innovation`
- `raw_materials_3_1`
- `raw_materials_3_2`
- `raw_materials_3_3`
- `raw_materials_3_4`
- `raw_materials_3_5`
- `raw_materials_3_6`
- `raw_materials_3_7`
- `raw_materials_3_8`
- `raw_materials_3_9`
- `raw_materials_3_10`
- `raw_materials_3_11`
- `raw_materials_3_12`
- `raw_materials_3_13`
- `raw_materials_3_14`
- `raw_materials_3_15`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_comments_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `product_design` | text | YES |
| `product_performance` | text | YES |
| `manfacturing_process` | text | YES |
| `waste_management` | text | YES |
| `life_cycle_approach` | text | YES |
| `product_stewardship` | text | YES |
| `product_innovation` | text | YES |
| `raw_materials_3_1` | text | YES |
| `raw_materials_3_2` | text | YES |
| `raw_materials_3_3` | text | YES |
| `raw_materials_3_4` | text | YES |
| `raw_materials_3_5` | text | YES |
| `raw_materials_3_6` | text | YES |
| `raw_materials_3_7` | text | YES |
| `raw_materials_3_8` | text | YES |
| `raw_materials_3_9` | text | YES |
| `raw_materials_3_10` | text | YES |
| `raw_materials_3_11` | text | YES |
| `raw_materials_3_12` | text | YES |
| `raw_materials_3_13` | text | YES |
| `raw_materials_3_14` | text | YES |
| `raw_materials_3_15` | text | YES |
| `updated_date` | date | NO |

---

## process_renew_innovation

| Property | Details |
|----------|--------|
| **Primary key** | `process_innovation_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (1)

`innovation_implementation_details`

### JSON / text fields

- `innovation_implementation_details`

### Blob / file path fields

_None._

### Enum / coded values

- **`process_innovation_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_innovation_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `innovation_implementation_details` | text | YES |
| `innovation_implementation_documents` | tinyint | NO |
| `process_innovation_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_manufacturing

| Property | Details |
|----------|--------|
| **Primary key** | `process_manufacturing_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (4)

`portable_water_demand`, `rain_water_harvesting`, `beyond_the_fence_initiatives`, `total_energy_consumption`

### JSON / text fields

- `portable_water_demand`
- `rain_water_harvesting`
- `beyond_the_fence_initiatives`

### Blob / file path fields

_None._

### Enum / coded values

- **`process_manufacturing_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_manufacturing_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `energy_conservation_supporting_documents` | tinyint | NO |
| `portable_water_demand` | text | YES |
| `rain_water_harvesting` | text | YES |
| `beyond_the_fence_initiatives` | text | YES |
| `total_energy_consumption` | int | YES |
| `energy_consumption_documents` | tinyint | NO |
| `process_manufacturing_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_mp_energy_consumption

| Property | Details |
|----------|--------|
| **Primary key** | `process_mp_energy_consumption_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- process_manufacturing_id → `process_manufacturing` (logical, not enforced)

### Nullable fields (2)

`energy_conservation_project`, `annual_energy_savings`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_mp_energy_consumption_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `process_manufacturing_id` | int | NO |
| `energy_conservation_project` | varchar(255) | YES |
| `annual_energy_savings` | varchar(50) | YES |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_mp_manufacturing_units

| Property | Details |
|----------|--------|
| **Primary key** | `process_mp_manufacturing_unit_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 66 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (62)

`unit_name`, `renewable_energy_utilization`, `ecd_year1`, `ecd_year2`, `ecd_year3`, `ecd_production_unit`, `ecd_production_year1`, `ecd_production_year2`, `ecd_production_year3`, `ecd_electric_unit`, `ecd_electric_year1`, `ecd_electric_year2`, `ecd_electric_year3`, `ecd_thermal_unit_fuel1`, `ecd_thermal_unit_fuel3`, `ecd_thermal_fuel1_year1`, `ecd_thermal_fuel1_year2`, `ecd_thermal_fuel1_year3`, `ecd_thermal_unit_fuel2`, `ecd_thermal_fuel2_year1`, `ecd_thermal_fuel2_year2`, `ecd_thermal_fuel2_year3`, `ecd_thermal_fuel3_year1`, `ecd_thermal_fuel3_year2`, `ecd_thermal_fuel3_year3`, `ecd_calorific_fuel1_year1`, `ecd_calorific_fuel1_year2`, `ecd_calorific_fuel1_year3`, `ecd_calorific_fuel2_year1`, `ecd_calorific_fuel2_year2`, `ecd_calorific_fuel2_year3`, `ecd_calorific_fuel3_year1`, `ecd_calorific_fuel3_year2`, `ecd_calorific_fuel3_year3`, `ecd_textarea_new_units`, `wcd_year1`, `wcd_year2`, `wcd_year3`, `wcd_production_unit`, `wcd_water_unit`, `wcd_production_year1`, `wcd_production_year2`, `wcd_production_year3`, `wcd_water_year1`, `wcd_water_year2`, `wcd_water_year3`, `re_year`, `re_solar_photovoltaic`, `re_wind`, `re_biomass`, `re_solar_thermal`, `re_others_unit`, `re_others`, `process_mp_manufacturing_unit_status`, `calculate_bulk_sec`, `calculate_bulk_swc`, `calculate_bulk_sec_multipled`, `calculate_bulk_swc_multipled`, `measures_implemented_mp_units`, `details_of_rain_water_harvesting_mp_units`, `created_date`, `updated_date`

### JSON / text fields

- `ecd_textarea_new_units`
- `calculate_bulk_sec_multipled`
- `calculate_bulk_swc_multipled`
- `measures_implemented_mp_units`
- `details_of_rain_water_harvesting_mp_units`

### Blob / file path fields

_None._

### Enum / coded values

- **`renewable_energy_utilization`:** 'yes','no'
- **`process_mp_manufacturing_unit_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_mp_manufacturing_unit_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `unit_name` | varchar(255) | YES |
| `renewable_energy_utilization` | enum('yes','no') | YES |
| `ecd_year1` | varchar(8) | YES |
| `ecd_year2` | varchar(8) | YES |
| `ecd_year3` | varchar(8) | YES |
| `ecd_production_unit` | varchar(8) | YES |
| `ecd_production_year1` | decimal(10,2) | YES |
| `ecd_production_year2` | decimal(10,2) | YES |
| `ecd_production_year3` | decimal(10,2) | YES |
| `ecd_electric_unit` | varchar(8) | YES |
| `ecd_electric_year1` | decimal(10,2) | YES |
| `ecd_electric_year2` | decimal(10,2) | YES |
| `ecd_electric_year3` | decimal(10,2) | YES |
| `ecd_thermal_unit_fuel1` | varchar(8) | YES |
| `ecd_thermal_unit_fuel3` | varchar(8) | YES |
| `ecd_thermal_fuel1_year1` | decimal(10,2) | YES |
| `ecd_thermal_fuel1_year2` | decimal(10,2) | YES |
| `ecd_thermal_fuel1_year3` | decimal(10,2) | YES |
| `ecd_thermal_unit_fuel2` | varchar(8) | YES |
| `ecd_thermal_fuel2_year1` | decimal(10,2) | YES |
| `ecd_thermal_fuel2_year2` | decimal(10,2) | YES |
| `ecd_thermal_fuel2_year3` | decimal(10,2) | YES |
| `ecd_thermal_fuel3_year1` | decimal(10,2) | YES |
| `ecd_thermal_fuel3_year2` | decimal(10,2) | YES |
| `ecd_thermal_fuel3_year3` | decimal(10,2) | YES |
| `ecd_calorific_fuel1_year1` | decimal(10,2) | YES |
| `ecd_calorific_fuel1_year2` | decimal(10,2) | YES |
| `ecd_calorific_fuel1_year3` | decimal(10,2) | YES |
| `ecd_calorific_fuel2_year1` | decimal(10,2) | YES |
| `ecd_calorific_fuel2_year2` | decimal(10,2) | YES |
| `ecd_calorific_fuel2_year3` | decimal(10,2) | YES |
| `ecd_calorific_fuel3_year1` | decimal(10,2) | YES |
| `ecd_calorific_fuel3_year2` | decimal(10,2) | YES |
| `ecd_calorific_fuel3_year3` | decimal(10,2) | YES |
| `ecd_textarea_new_units` | text | YES |
| `wcd_year1` | varchar(8) | YES |
| `wcd_year2` | varchar(8) | YES |
| `wcd_year3` | varchar(8) | YES |
| `wcd_production_unit` | varchar(8) | YES |
| `wcd_water_unit` | varchar(8) | YES |
| `wcd_production_year1` | decimal(10,2) | YES |
| `wcd_production_year2` | decimal(10,2) | YES |
| `wcd_production_year3` | decimal(10,2) | YES |
| `wcd_water_year1` | decimal(10,2) | YES |
| `wcd_water_year2` | decimal(10,2) | YES |
| `wcd_water_year3` | decimal(10,2) | YES |
| `re_year` | varchar(8) | YES |
| `re_solar_photovoltaic` | decimal(10,2) | YES |
| `re_wind` | decimal(10,2) | YES |
| `re_biomass` | decimal(10,2) | YES |
| `re_solar_thermal` | decimal(10,2) | YES |
| `re_others_unit` | varchar(8) | YES |
| `re_others` | decimal(10,2) | YES |
| `offsite_renewable_power` | int | NO |
| `process_mp_manufacturing_unit_status` | tinyint | YES |
| `calculate_bulk_sec` | int | YES |
| `calculate_bulk_swc` | int | YES |
| `calculate_bulk_sec_multipled` | text | YES |
| `calculate_bulk_swc_multipled` | text | YES |
| `measures_implemented_mp_units` | text | YES |
| `details_of_rain_water_harvesting_mp_units` | text | YES |
| `created_date` | datetime | YES |
| `updated_date` | datetime | YES |

---

## process_renew_product_performance

| Property | Details |
|----------|--------|
| **Primary key** | `process_product_performance_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 11 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

_None._

### Blob / file path fields

- `test_report_file_name`

### Enum / coded values

- **`product_performance_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_product_performance_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `eoi_no` | varchar(20) | NO |
| `product_name` | varchar(255) | NO |
| `test_report_file_name` | varchar(255) | NO |
| `test_report_files` | tinyint | NO |
| `renewal_type` | int | NO |
| `product_performance_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_product_stewardship

| Property | Details |
|----------|--------|
| **Primary key** | `process_product_stewardship_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (3)

`quality_management_details`, `epr_implemented_details`, `epr_green_packaging_details`

### JSON / text fields

- `quality_management_details`
- `epr_implemented_details`
- `epr_green_packaging_details`

### Blob / file path fields

_None._

### Enum / coded values

- **`product_stewardship_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_product_stewardship_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `sea_supporting_documents` | tinyint | NO |
| `quality_management_details` | text | YES |
| `qm_supporting_documents` | tinyint | NO |
| `epr_implemented_details` | text | YES |
| `epr_green_packaging_details` | text | YES |
| `epr_supporting_documents` | tinyint | NO |
| `product_stewardship_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_ps_stakeholder_edu_awarness

| Property | Details |
|----------|--------|
| **Primary key** | `process_ps_stakeholder_edu_awerness_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 10 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- process_product_stewardship_id → `process_product_stewardships` (logical, not enforced)

### Nullable fields (1)

`sea_no_of_programs`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

- **`product_stewardship_status`:** 0=Pending,1=Completed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_ps_stakeholder_edu_awerness_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `process_product_stewardship_id` | int | NO |
| `sea_program_details` | varchar(255) | NO |
| `sea_no_of_programs` | varchar(50) | YES |
| `sea_supporting_documents` | tinyint | NO |
| `product_stewardship_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_waste_management

| Property | Details |
|----------|--------|
| **Primary key** | `process_waste_management_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (1)

`wm_implementation_details`

### JSON / text fields

- `wm_implementation_details`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_waste_management_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `wm_implementation_details` | text | YES |
| `wm_supporting_documents` | tinyint | NO |
| `process_waste_management_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_renew_wm_manufacturing_units

| Property | Details |
|----------|--------|
| **Primary key** | `process_wm_manufacturing_unit_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 34 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- process_waste_management_id → `process_waste_managements` (logical, not enforced)

### Nullable fields (31)

`process_waste_management_id`, `unit_name`, `hazardous_waste_year1`, `hazardous_waste_year2`, `hazardous_waste_year3`, `hazardous_waste_production_unit`, `hazardous_waste_quantity_unit`, `hazardous_waste_production_year1`, `hazardous_waste_production_year2`, `hazardous_waste_production_year3`, `hazardous_waste_quantity_year1`, `hazardous_waste_quantity_year2`, `hazardous_waste_quantity_year3`, `non_hazardous_waste_year1`, `non_hazardous_waste_year2`, `non_hazardous_waste_year3`, `non_hazardous_waste_production_unit`, `non_hazardous_waste_water_unit`, `non_hazardous_waste_production_year1`, `non_hazardous_waste_production_year2`, `non_hazardous_waste_production_year3`, `non_hazardous_waste_water_year1`, `non_hazardous_waste_water_year2`, `non_hazardous_waste_water_year3`, `calculate_bulk_rshwd`, `calculate_bulk_rsnhwd`, `calculate_bulk_rshwd_multipled`, `calculate_bulk_rsnhwd_multipled`, `wm_implementation_details_wm_units`, `created_date`, `updated_date`

### JSON / text fields

- `calculate_bulk_rshwd_multipled`
- `calculate_bulk_rsnhwd_multipled`
- `wm_implementation_details_wm_units`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_wm_manufacturing_unit_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `process_waste_management_id` | int | YES |
| `unit_name` | varchar(255) | YES |
| `hazardous_waste_year1` | varchar(8) | YES |
| `hazardous_waste_year2` | varchar(8) | YES |
| `hazardous_waste_year3` | varchar(8) | YES |
| `hazardous_waste_production_unit` | varchar(8) | YES |
| `hazardous_waste_quantity_unit` | varchar(8) | YES |
| `hazardous_waste_production_year1` | float | YES |
| `hazardous_waste_production_year2` | float | YES |
| `hazardous_waste_production_year3` | float | YES |
| `hazardous_waste_quantity_year1` | float | YES |
| `hazardous_waste_quantity_year2` | float | YES |
| `hazardous_waste_quantity_year3` | float | YES |
| `non_hazardous_waste_year1` | varchar(8) | YES |
| `non_hazardous_waste_year2` | varchar(8) | YES |
| `non_hazardous_waste_year3` | varchar(8) | YES |
| `non_hazardous_waste_production_unit` | varchar(8) | YES |
| `non_hazardous_waste_water_unit` | varchar(8) | YES |
| `non_hazardous_waste_production_year1` | float | YES |
| `non_hazardous_waste_production_year2` | float | YES |
| `non_hazardous_waste_production_year3` | float | YES |
| `non_hazardous_waste_water_year1` | float | YES |
| `non_hazardous_waste_water_year2` | float | YES |
| `non_hazardous_waste_water_year3` | float | YES |
| `calculate_bulk_rshwd` | int | YES |
| `calculate_bulk_rsnhwd` | int | YES |
| `calculate_bulk_rshwd_multipled` | text | YES |
| `calculate_bulk_rsnhwd_multipled` | text | YES |
| `wm_implementation_details_wm_units` | text | YES |
| `created_date` | datetime | YES |
| `updated_date` | datetime | YES |

---

## process_waste_management

| Property | Details |
|----------|--------|
| **Primary key** | `process_waste_management_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (1)

`wm_implementation_details`

### JSON / text fields

- `wm_implementation_details`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_waste_management_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `wm_implementation_details` | text | YES |
| `wm_supporting_documents` | tinyint | NO |
| `process_waste_management_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## process_wm_manufacturing_units

| Property | Details |
|----------|--------|
| **Primary key** | `process_wm_manufacturing_unit_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 34 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)
- process_waste_management_id → `process_waste_managements` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- ADD FULLTEXT KEY urn_no (urn_no)

### Nullable fields (31)

`process_waste_management_id`, `unit_name`, `hazardous_waste_year1`, `hazardous_waste_year2`, `hazardous_waste_year3`, `hazardous_waste_production_unit`, `hazardous_waste_quantity_unit`, `hazardous_waste_production_year1`, `hazardous_waste_production_year2`, `hazardous_waste_production_year3`, `hazardous_waste_quantity_year1`, `hazardous_waste_quantity_year2`, `hazardous_waste_quantity_year3`, `non_hazardous_waste_year1`, `non_hazardous_waste_year2`, `non_hazardous_waste_year3`, `non_hazardous_waste_production_unit`, `non_hazardous_waste_water_unit`, `non_hazardous_waste_production_year1`, `non_hazardous_waste_production_year2`, `non_hazardous_waste_production_year3`, `non_hazardous_waste_water_year1`, `non_hazardous_waste_water_year2`, `non_hazardous_waste_water_year3`, `calculate_bulk_rshwd`, `calculate_bulk_rsnhwd`, `calculate_bulk_rshwd_multipled`, `calculate_bulk_rsnhwd_multipled`, `wm_implementation_details_wm_units`, `created_date`, `updated_date`

### JSON / text fields

- `calculate_bulk_rshwd_multipled`
- `calculate_bulk_rsnhwd_multipled`
- `wm_implementation_details_wm_units`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `process_wm_manufacturing_unit_id` | int | NO |
| `vendor_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `process_waste_management_id` | int | YES |
| `unit_name` | varchar(255) | YES |
| `hazardous_waste_year1` | varchar(8) | YES |
| `hazardous_waste_year2` | varchar(8) | YES |
| `hazardous_waste_year3` | varchar(8) | YES |
| `hazardous_waste_production_unit` | varchar(8) | YES |
| `hazardous_waste_quantity_unit` | varchar(8) | YES |
| `hazardous_waste_production_year1` | float | YES |
| `hazardous_waste_production_year2` | float | YES |
| `hazardous_waste_production_year3` | float | YES |
| `hazardous_waste_quantity_year1` | float | YES |
| `hazardous_waste_quantity_year2` | float | YES |
| `hazardous_waste_quantity_year3` | float | YES |
| `non_hazardous_waste_year1` | varchar(8) | YES |
| `non_hazardous_waste_year2` | varchar(8) | YES |
| `non_hazardous_waste_year3` | varchar(8) | YES |
| `non_hazardous_waste_production_unit` | varchar(8) | YES |
| `non_hazardous_waste_water_unit` | varchar(8) | YES |
| `non_hazardous_waste_production_year1` | float | YES |
| `non_hazardous_waste_production_year2` | float | YES |
| `non_hazardous_waste_production_year3` | float | YES |
| `non_hazardous_waste_water_year1` | float | YES |
| `non_hazardous_waste_water_year2` | float | YES |
| `non_hazardous_waste_water_year3` | float | YES |
| `calculate_bulk_rshwd` | int | YES |
| `calculate_bulk_rsnhwd` | int | YES |
| `calculate_bulk_rshwd_multipled` | text | YES |
| `calculate_bulk_rsnhwd_multipled` | text | YES |
| `wm_implementation_details_wm_units` | text | YES |
| `created_date` | datetime | YES |
| `updated_date` | datetime | YES |

---

## products

| Property | Details |
|----------|--------|
| **Primary key** | `product_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 24 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- category_id → `categories` (logical, not enforced)
- vendor_id → `vendors` (logical, not enforced)
- manufacturer_id → `manufacturers` (logical, not enforced)

### Indexes

- KEY category_id (category_id)
- KEY vendor_id (vendor_id)
- KEY vendor_id_and_urn_no (urn_no,vendor_id)
- KEY manufacturer_id (manufacturer_id)
- ADD FULLTEXT KEY urn_no (urn_no)
- ADD FULLTEXT KEY eoi_no (eoi_no)

### Nullable fields (8)

`renewed_date`, `assessment_report_url`, `rejected_details`, `certified_date`, `validtill_date`, `first_notify_date`, `second_notify_date`, `third_notify_date`

### JSON / text fields

- `product_details`

### Blob / file path fields

- `product_image`
- `assessment_report_url`

### Enum / coded values

- **`product_status`:** 0=Pending,1=Submitted,2=Certified,3=Rejected
- **`product_renew_status`:** 0=Pending,1=Submitted,2=Renewed,3=Rejected 

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_id` | int | NO |
| `category_id` | int | NO |
| `vendor_id` | int | NO |
| `manufacturer_id` | int | NO |
| `eoi_no` | varchar(20) | NO |
| `urn_no` | varchar(20) | NO |
| `product_name` | varchar(255) | NO |
| `product_image` | varchar(255) | NO |
| `plant_count` | int | NO |
| `product_details` | text | NO |
| `product_type` | tinyint | NO |
| `product_status` | tinyint | NO |
| `product_renew_status` | tinyint | NO |
| `renewed_date` | datetime | YES |
| `urn_status` | tinyint | NO |
| `assessment_report_url` | varchar(255) | YES |
| `rejected_details` | date | YES |
| `certified_date` | date | YES |
| `validtill_date` | date | YES |
| `first_notify_date` | date | YES |
| `second_notify_date` | date | YES |
| `third_notify_date` | date | YES |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## product_plants

| Property | Details |
|----------|--------|
| **Primary key** | `product_plant_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 14 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- product_id → `products` (logical, not enforced)
- vendor_id → `vendors` (logical, not enforced)
- category_id → `categories` (logical, not enforced)
- manufacturer_id → `manufacturers` (logical, not enforced)

### Indexes

- KEY product_id (product_id)
- KEY vendor_id (vendor_id)
- KEY category_id (category_id)
- KEY vendor_id_and_product_id (product_id,vendor_id)

### Nullable fields (3)

`additional_plant_info`, `state`, `city`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `product_plant_id` | int | NO |
| `product_id` | int | NO |
| `vendor_id` | int | NO |
| `category_id` | int | NO |
| `manufacturer_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `eoi_no` | varchar(20) | NO |
| `plant_name` | varchar(100) | NO |
| `additional_plant_info` | varchar(255) | YES |
| `plant_location` | varchar(255) | NO |
| `state` | varchar(100) | YES |
| `city` | varchar(100) | YES |
| `plant_status` | tinyint | NO |
| `created_date` | datetime | NO |

---

## raw_materials_additives

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_additives_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 21 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`
- `psc`
- `coc`
- `percentcoc`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_additives_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `year1` | int | NO |
| `year1a` | int | NO |
| `year1b` | int | NO |
| `year1c` | int | NO |
| `year2` | int | NO |
| `year2a` | int | NO |
| `year2b` | int | NO |
| `year2c` | int | NO |
| `year3` | int | NO |
| `year3a` | int | NO |
| `year3b` | int | NO |
| `year3c` | int | NO |
| `psc` | text | NO |
| `coc` | text | NO |
| `percentcoc` | text | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_elimination_of_formaldehyde

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_elimination_of_formaldehyde_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 7 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `products_name`
- `products_test_report`

### Blob / file path fields

- `products_test_report`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_elimination_of_formaldehyde_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `products_name` | text | NO |
| `products_test_report` | text | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_elimination_of_prohibited_flame

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_elimination_of_prohibited_flame_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 6 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (1)

`measures_implemented`

### JSON / text fields

- `measures_implemented`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_elimination_of_prohibited_flame_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `measures_implemented` | text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | YES |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_elimination_of_prohibited_flame_solvents

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_elimination_of_prohibited_flame_solvents_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 6 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (1)

`details`

### JSON / text fields

- `details`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_elimination_of_prohibited_flame_solvents_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `details` | text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | YES |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_elimination_of_prohibited_flame_solvents_products

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_elimination_prohibited_flame_solvents_products_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 7 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `products_name`
- `products_test_report`

### Blob / file path fields

- `products_test_report`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_elimination_prohibited_flame_solvents_products_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `products_name` | text | NO |
| `products_test_report` | text | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_green_supply

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_green_supply_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 7 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (2)

`awareness_and_education`, `measures_implemented`

### JSON / text fields

- `awareness_and_education`
- `measures_implemented`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_green_supply_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `awareness_and_education` | text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | YES |
| `measures_implemented` | text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | YES |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_hazardous

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_hazardous_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 6 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (1)

`details`

### JSON / text fields

- `details`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_hazardous_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `details` | text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | YES |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_hazardous_products

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_hazardous_products_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 7 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `products_name`
- `products_test_report`

### Blob / file path fields

- `products_test_report`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_hazardous_products_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `products_name` | text | NO |
| `products_test_report` | text | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_optimization_of_raw_mix

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_optimization_of_raw_mix_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 10 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_optimization_of_raw_mix_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `year` | int | NO |
| `yeardata1` | int | NO |
| `yeardata2` | int | NO |
| `yeardata3` | int | NO |
| `created_date` | int | NO |
| `updated_date` | int | NO |

---

## raw_materials_rapidly_renewable_materials

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_rapidly_renewable_materials_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_rapidly_renewable_materials_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `year` | int | NO |
| `unit1` | int | NO |
| `yeardata1` | int | NO |
| `unit2` | int | NO |
| `yeardata2` | int | NO |
| `yeardata3` | int | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_recovery

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_recovery_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_recovery_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `year` | int | NO |
| `unit1` | int | NO |
| `yeardata1` | int | NO |
| `unit2` | int | NO |
| `yeardata2` | int | NO |
| `yeardata3` | int | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_recycled_content

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_recycled_content_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_recycled_content_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `year` | int | NO |
| `unit1` | int | NO |
| `yeardata1` | int | NO |
| `unit2` | int | NO |
| `yeardata2` | int | NO |
| `yeardata3` | int | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_reduce_environmental

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_reduce_environmental_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 11 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `location`
- `enhancement_of_mines_life`
- `topsoil_conservation`
- `water_table_management`
- `restoration_of_spent_mines`
- `green_belt_development_and_bio_diversity`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_reduce_environmental_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `location` | text | NO |
| `enhancement_of_mines_life` | text | NO |
| `topsoil_conservation` | text | NO |
| `water_table_management` | text | NO |
| `restoration_of_spent_mines` | text | NO |
| `green_belt_development_and_bio_diversity` | text | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_regional_materials

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_regional_materials_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_regional_materials_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `year` | int | NO |
| `unit1` | int | NO |
| `yeardata1` | int | NO |
| `unit2` | int | NO |
| `yeardata2` | int | NO |
| `yeardata3` | int | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_utilization

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_utilization_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 6 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (1)

`details`

### JSON / text fields

- `details`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_utilization_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `details` | text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci | YES |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## raw_materials_utilization_manufacturing_units

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_utilization_manufacturing_units_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 10 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

- `unit_name`

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_utilization_manufacturing_units_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `unit_name` | text | NO |
| `yeardata1` | int | NO |
| `yeardata2` | int | NO |
| `yeardata3` | int | NO |
| `created_date` | int | NO |
| `updated_date` | int | NO |
| `year` | int | NO |

---

## raw_materials_utilization_rmc

| Property | Details |
|----------|--------|
| **Primary key** | `raw_materials_utilization_rmc_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 111 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `raw_materials_utilization_rmc_id` | int | NO |
| `urn_no` | varchar(20) | NO |
| `vendor_id` | int | NO |
| `consumption_year1` | int | NO |
| `consumption_year2` | int | NO |
| `consumption_year3` | int | NO |
| `cement1` | int | NO |
| `flyash1` | int | NO |
| `coarse_aggregate1` | int | NO |
| `fine_aggregate1` | int | NO |
| `admixture1` | int | NO |
| `alcofine1` | int | NO |
| `ggbs1` | int | NO |
| `any_other_material1` | int | NO |
| `total1` | int | NO |
| `cement2` | int | NO |
| `flyash2` | int | NO |
| `coarse_aggregate2` | int | NO |
| `fine_aggregate2` | int | NO |
| `admixture2` | int | NO |
| `alcofine2` | int | NO |
| `ggbs2` | int | NO |
| `any_other_material2` | int | NO |
| `total2` | int | NO |
| `cement3` | int | NO |
| `flyash3` | int | NO |
| `coarse_aggregate3` | int | NO |
| `fine_aggregate3` | int | NO |
| `admixture3` | int | NO |
| `alcofine3` | int | NO |
| `ggbs3` | int | NO |
| `any_other_material3` | int | NO |
| `total3` | int | NO |
| `production_year1` | int | NO |
| `production_year2` | int | NO |
| `production_year3` | int | NO |
| `brand_concrete_with_high_scm` | int | NO |
| `brand_high_strength_concrete` | int | NO |
| `brand_self_cpmacting_concrete` | int | NO |
| `brand_low_density_concrete` | int | NO |
| `brand_clsm_concrete` | int | NO |
| `brand_any_other_types` | int | NO |
| `brand_total_concrete` | int | NO |
| `production_year1_concrete_with_high_scm` | int | NO |
| `production_year1_high_strength_concrete` | int | NO |
| `production_year1_self_cpmacting_concrete` | int | NO |
| `production_year1_low_density_concrete` | int | NO |
| `production_year1_clsm_concrete` | int | NO |
| `production_year1_any_other_types` | int | NO |
| `production_year1_total_concrete` | int | NO |
| `production_year2_concrete_with_high_scm` | int | NO |
| `production_year2_high_strength_concrete` | int | NO |
| `production_year2_self_cpmacting_concrete` | int | NO |
| `production_year2_low_density_concrete` | int | NO |
| `production_year2_clsm_concrete` | int | NO |
| `production_year2_any_other_types` | int | NO |
| `production_year2_total_concrete` | int | NO |
| `production_year3_concrete_with_high_scm` | int | NO |
| `production_year3_high_strength_concrete` | int | NO |
| `production_year3_self_cpmacting_concrete` | int | NO |
| `production_year3_low_density_concrete` | int | NO |
| `production_year3_clsm_concrete` | int | NO |
| `production_year3_any_other_types` | int | NO |
| `production_year3_total_concrete` | int | NO |
| `total_year` | int | NO |
| `total_quantity_of_opc_used` | int | NO |
| `total_quantity_of_supplementary` | int | NO |
| `opc_substitution` | int | NO |
| `percent_year1_iron` | int | NO |
| `percent_year2_iron` | int | NO |
| `percent_year3_iron` | int | NO |
| `percent_year4_iron` | int | NO |
| `percent_year1_steel` | int | NO |
| `percent_year2_steel` | int | NO |
| `percent_year3_steel` | int | NO |
| `percent_year4_steel` | int | NO |
| `percent_year1_recycled` | int | NO |
| `percent_year2_recycled` | int | NO |
| `percent_year3_recycled` | int | NO |
| `percent_year4_recycled` | int | NO |
| `percent_year1_subsititution_iron` | int | NO |
| `percent_year2_subsititution_iron` | int | NO |
| `percent_year3_subsititution_iron` | int | NO |
| `percent_year4_subsititution_iron` | int | NO |
| `percent_year1_subsititution_steel` | int | NO |
| `percent_year2_subsititution_steel` | int | NO |
| `percent_year3_subsititution_steel` | int | NO |
| `percent_year4_subsititution_steel` | int | NO |
| `percent_year1_subsititution_copper` | int | NO |
| `percent_year2_subsititution_copper` | int | NO |
| `percent_year3_subsititution_copper` | int | NO |
| `percent_year4_subsititution_copper` | int | NO |
| `percent_year1_subsititution_recycled` | int | NO |
| `percent_year2_subsititution_recycled` | int | NO |
| `percent_year3_subsititution_recycled` | int | NO |
| `percent_year4_subsititution_recycled` | int | NO |
| `percent_year1_subsititution_aggregate` | int | NO |
| `percent_year2_subsititution_aggregate` | int | NO |
| `percent_year3_subsititution_aggregate` | int | NO |
| `percent_year4_subsititution_aggregate` | int | NO |
| `plant1` | int | NO |
| `plant_year1` | int | NO |
| `plant_year2` | int | NO |
| `plant_year3` | int | NO |
| `plant_year4` | int | NO |
| `plant_year1_percent_substitution` | int | NO |
| `plant_year2_percent_substitution` | int | NO |
| `plant_year3_percent_substitution` | int | NO |
| `plant_year4_percent_substitution` | int | NO |
| `created_date` | date | NO |
| `updated_date` | date | NO |

---

## sectors

| Property | Details |
|----------|--------|
| **Primary key** | `id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 5 |

### Foreign keys

_None identified._

### Nullable fields (2)

`name`, `updated_at`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `id` | int | NO |
| `name` | varchar(55) | YES |
| `status` | tinyint | NO |
| `created_at` | datetime | NO |
| `updated_at` | datetime | YES |

---

## standards

| Property | Details |
|----------|--------|
| **Primary key** | `id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 8 |

### Foreign keys

_None identified._

### Nullable fields (5)

`name`, `filename`, `original_filename`, `resourse_standard_type`, `updated_at`

### JSON / text fields

_None._

### Blob / file path fields

- `filename`
- `original_filename`

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `id` | int | NO |
| `name` | varchar(255) | YES |
| `filename` | varchar(255) | YES |
| `original_filename` | varchar(255) | YES |
| `resourse_standard_type` | varchar(80) | YES |
| `status` | tinyint | NO |
| `created_at` | datetime | NO |
| `updated_at` | datetime | YES |

---

## states

| Property | Details |
|----------|--------|
| **Primary key** | `id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 10 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- country_id → `countrys` (logical, not enforced)

### Nullable fields (7)

`state_code`, `created_by`, `created_at`, `updated_by`, `updated_at`, `deleted_by`, `deleted_at`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

_No MySQL ENUM columns; no status COMMENT fields._

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `id` | int | NO |
| `name` | varchar(30) | NO |
| `country_id` | int | NO |
| `state_code` | int | YES |
| `created_by` | int | YES |
| `created_at` | timestamp NULL | YES |
| `updated_by` | int | YES |
| `updated_at` | timestamp NULL | YES |
| `deleted_by` | int | YES |
| `deleted_at` | timestamp NULL | YES |

---

## subscription_list

| Property | Details |
|----------|--------|
| **Primary key** | `subscription_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 6 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- email_id → `emails` (logical, not enforced)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

- **`subscription_status`:** 0=Unsubscribed,1=Subscribed

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `subscription_id` | int | NO |
| `email_id` | varchar(255) | NO |
| `subscription_type` | tinyint | NO |
| `subscription_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## team_members

| Property | Details |
|----------|--------|
| **Primary key** | `team_member_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_None identified._

### Nullable fields (3)

`team_member_facebook_url`, `team_member_twitter_url`, `team_member_linkedin_url`

### JSON / text fields

_None._

### Blob / file path fields

- `team_member_linkedin_url`
- `team_member_image`

### Enum / coded values

- **`team_member_status`:** 0=Inactive,1=Active

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `team_member_id` | int | NO |
| `team_member_name` | varchar(100) | NO |
| `team_member_designation` | varchar(50) | NO |
| `team_member_email` | varchar(100) | NO |
| `team_member_phone` | varchar(20) | NO |
| `team_member_facebook_url` | varchar(100) | YES |
| `team_member_twitter_url` | varchar(100) | YES |
| `team_member_linkedin_url` | varchar(100) | YES |
| `team_member_image` | varchar(100) | NO |
| `team_member_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## vendors

| Property | Details |
|----------|--------|
| **Primary key** | `vendor_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 12 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- manufacturer_id → `manufacturers` (logical, not enforced)

### Nullable fields (6)

`vendor_name`, `vendor_phone`, `vendor_website`, `vendor_designation`, `vendor_gst`, `notify_on`

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

- **`vendor_status`:** 0=Unverified,1=Active,2=Inactive

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `vendor_id` | int | NO |
| `manufacturer_id` | int | NO |
| `vendor_name` | varchar(255) | YES |
| `vendor_email` | varchar(255) | NO |
| `vendor_phone` | varchar(20) | YES |
| `vendor_website` | varchar(255) | YES |
| `vendor_designation` | varchar(100) | YES |
| `vendor_gst` | varchar(255) | YES |
| `vendor_status` | tinyint | NO |
| `notify_on` | timestamp NULL | YES |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

## vendor_users

| Property | Details |
|----------|--------|
| **Primary key** | `vendor_user_id` |
| **Row count** | N/A (no INSERT data in dump) |
| **Column count** | 10 |

### Foreign keys

_No enforced FK constraints. Logical references:_

- vendor_id → `vendors` (logical, not enforced)

### Indexes

- KEY vendor_id (vendor_id)
- KEY vendor_user_status (vendor_user_status)
- ADD FULLTEXT KEY vendor_user_email (vendor_user_email)
- ADD FULLTEXT KEY vendor_user_password (vendor_user_password)

### Nullable fields (0)

_None (all NOT NULL)._

### JSON / text fields

_None._

### Blob / file path fields

_None._

### Enum / coded values

- **`vendor_user_type`:** 'vendor','partner'
- **`vendor_user_status`:** 0=Inactive,1=Active,2=Deleted

### Columns

| Column | Type | Nullable |
|--------|------|----------|
| `vendor_user_id` | int | NO |
| `vendor_id` | int | NO |
| `vendor_user_name` | varchar(255) | NO |
| `vendor_user_email` | varchar(255) | NO |
| `vendor_user_phone` | varchar(20) | NO |
| `vendor_user_password` | varchar(200) | NO |
| `vendor_user_type` | enum('vendor','partner') | NO |
| `vendor_user_status` | tinyint | NO |
| `created_date` | datetime | NO |
| `updated_date` | datetime | NO |

---

