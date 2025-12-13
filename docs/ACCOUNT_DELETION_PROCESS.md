# Account Deletion Process Documentation

## Overview

This document describes the complete account deletion workflow in the Shoppy+ application, including user-facing steps, admin procedures, and technical implementation details.

---

## Table of Contents

1. [User Journey](#user-journey)
2. [Data Deletion Details](#data-deletion-details)
3. [Admin Process](#admin-process)
4. [Technical Implementation](#technical-implementation)
5. [Email Templates](#email-templates)
6. [Timeline & Expectations](#timeline--expectations)
7. [FAQ](#faq)

---

## User Journey

### Step-by-Step Account Deletion Process

#### **Step 1: Navigate to Account Settings**
- User logs into the app
- Goes to the **Profile Tab** (bottom navigation bar)
- Taps on **Account** button in the Settings section
- Arrives at the **Account Screen**

#### **Step 2: Access Account Actions**
- Scrolls down to **Account Actions** section
- Finds the **Delete Account** button (red/danger styling)
- Taps on the button

#### **Step 3: Review Deletion Information**
- Arrives at the **Delete Account Screen**
- Reads important information:
  - ⚠️ **Warning banner**: "Account Deletion Request" - This action cannot be undone
  - ⏱️ **Timeline card**: Processing takes up to 48 hours
  - 📋 **Data deletion list**: All data that will be removed
  - 📌 **Info box**: Confirmation about email notification

#### **Step 4: Initiate Deletion Request**
- Reviews all information carefully
- Scrolls to bottom and taps **"Request Account Deletion"** button
- Red/warning colored button at bottom of screen

#### **Step 5: Confirmation Dialog**
- A modal popup appears with:
  - 🗑️ Icon
  - Title: **"Are you sure?"**
  - Warning message about permanent deletion
  - 3-point warning list:
    - All data will be deleted within 48 hours
    - You cannot undo this action
    - You will be logged out immediately
  - Two buttons: **Cancel** and **Confirm Deletion**

#### **Step 6: Final Confirmation**
- User taps **"Confirm Deletion"** button
- Loading spinner appears on button
- System processes the request:
  - Sends email to admin
  - Signs out the user
  - Redirects to login screen

#### **Step 7: Completion**
- User sees success message: "Deletion Request Submitted"
- Message states: "We will process it within 48 hours. You will receive a confirmation email shortly."
- User is logged out and back to login screen

---

## Data Deletion Details

### Data That Will Be Removed

When an account is deleted, the following data is permanently removed from our systems:

| Data Type | Details |
|-----------|---------|
| **👤 Full Name** | User's full name from profile |
| **📧 Email Address** | Associated email address |
| **📱 Phone Number** | Contact phone number |
| **🗂️ All Personal Data** | Any other stored personal information |

---

## Support

For questions about the account deletion process:
- Email: support@shoppy.com
- In-app Help Center
- Contact admin directly

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-13 | Initial documentation |

---

**Last Updated:** December 13, 2024  
**Document Owner:** Admin Team  
**Status:** Active
