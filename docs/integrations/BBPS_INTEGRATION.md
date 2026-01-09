# BBPS Integration Guide

## Overview

BBPS (Bharat Bill Payment System) integration has been completed for automatic electricity bill fetching. This allows users to automatically fetch their latest electricity bills from their DISCOM through the BBPS network.

## What's Been Implemented

### 1. BBPS Client (`lib/bbps/client.ts`)
- Complete BBPS API client with authentication
- Bill fetching functionality
- Consumer number validation
- Error handling and response transformation

### 2. API Route (`app/api/bills/fetch/route.ts`)
- POST endpoint to fetch bills from BBPS
- Automatic credit application after bill fetch
- Duplicate bill detection
- Utility validation

### 3. Frontend Integration (`app/bills/page.tsx`)
- "Fetch Latest Bill" button
- Loading states and error handling
- Success messages
- Automatic bill list refresh

## Setup Steps

### Step 1: Get BBPS API Credentials

1. Register with a BBPS-certified BBPO (Bharat Bill Payment Operating Unit)
   - Popular options: Paytm, PhonePe, Razorpay BBPS, etc.
2. Complete KYC and get API credentials:
   - `BBPS_API_KEY` - Your API key
   - `BBPS_API_SECRET` - Your API secret
   - `BBPS_BASE_URL` - API base URL (provided by your BBPO)

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# BBPS Integration
BBPS_API_KEY=your_bbps_api_key_here
BBPS_API_SECRET=your_bbps_api_secret_here
BBPS_BASE_URL=https://api.bbps.com/v1
```

**Note:** The actual base URL will be provided by your BBPS service provider. Common providers:
- Paytm BBPS: `https://api.paytm.com/bbps`
- PhonePe BBPS: `https://api.phonepe.com/bbps`
- Razorpay BBPS: `https://api.razorpay.com/v1/bbps`

### Step 3: Update BBPS Client Configuration

If your BBPS provider uses a different authentication method or endpoint structure, update `lib/bbps/client.ts`:

1. **Authentication Method**: Some providers use OAuth2, API keys in headers, or different token formats
2. **Endpoint URLs**: Update the base URL and specific endpoints
3. **Request/Response Format**: Adjust the request body and response parsing based on your provider's API documentation

### Step 4: Test the Integration

1. Ensure a user has connected their utility (state, DISCOM, consumer number)
2. Navigate to `/bills` page
3. Click "Fetch Latest Bill" button
4. The system will:
   - Authenticate with BBPS
   - Fetch the latest bill
   - Store it in the database
   - Automatically apply available credits
   - Display the bill in the list

## How It Works

### Flow Diagram

```
User clicks "Fetch Latest Bill"
    ↓
Check if utility is connected
    ↓
Validate consumer number format
    ↓
Authenticate with BBPS API
    ↓
Fetch bill from BBPS
    ↓
Check for duplicate bills
    ↓
Store bill in database
    ↓
Auto-apply available credits
    ↓
Update bill status (PAID/PENDING)
    ↓
Return success response
```

### Consumer Number Validation

The system validates consumer numbers based on DISCOM-specific patterns:
- **BSES Rajdhani/Yamuna**: 10-12 digits
- **Tata Power**: 10-12 digits
- **Adani Electricity**: 10-12 digits
- **BEST**: 8-12 digits
- **Default**: 8-15 alphanumeric characters

You can add more DISCOM-specific patterns in `lib/bbps/client.ts`.

## Error Handling

The integration handles various error scenarios:

1. **BBPS_NOT_CONFIGURED**: API credentials not set
2. **UTILITY_NOT_CONNECTED**: User hasn't connected utility
3. **UTILITY_INCOMPLETE**: Missing utility information
4. **INVALID_CONSUMER_NUMBER**: Consumer number format invalid
5. **BILL_EXISTS**: Bill already fetched
6. **BBPS_FETCH_ERROR**: BBPS API error
7. **DB_ERROR**: Database error

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bill_number": "123456789",
    "amount": 2500.00,
    "due_date": "2026-02-15T00:00:00Z",
    "bill_month": 1,
    "bill_year": 2026,
    "discom": "BSES Rajdhani",
    "status": "PENDING",
    "credits_applied": 500.00,
    "final_amount": 2000.00
  },
  "message": "Bill fetched and credits applied successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BBPS_FETCH_ERROR",
    "message": "Failed to fetch bill from BBPS"
  }
}
```

## Testing Without BBPS

If you don't have BBPS credentials yet, the system will:
- Show appropriate error messages
- Allow manual bill entry (existing functionality)
- Work with mock data for development

## Next Steps

1. **Get BBPS Credentials**: Register with a BBPS-certified provider
2. **Configure Environment Variables**: Add credentials to `.env.local`
3. **Test Integration**: Use the "Fetch Latest Bill" button
4. **Monitor Logs**: Check for any BBPS API errors
5. **Add More DISCOMs**: Extend consumer number validation patterns

## Support

For BBPS API issues:
- Check your BBPO provider's documentation
- Verify API credentials are correct
- Ensure your account has bill fetching permissions
- Contact your BBPS provider's support team

## Notes

- BBPS API endpoints and authentication methods may vary by provider
- Some DISCOMs may not be available on all BBPS networks
- Bill fetching may have rate limits (check with your provider)
- Consumer number formats vary by DISCOM

