# Bug Condition Exploration Results

## Test Execution Summary

**Test File**: `lib/actions/payroll/makeup-work-penalty.test.ts`
**Test Date**: Task 1 - Bug Condition Exploration
**Test Status**: ✅ Completed - Bug Confirmed

## Bug Confirmation

The bug condition exploration test successfully confirmed the bug exists in the unfixed codebase. The test generated 20 counterexamples demonstrating that employees with `late_early_makeup` requests who checkout before their committed `to_time` are NOT penalized.

### Bug Location

**File**: `lib/actions/payroll/generate-payroll.ts`
**Lines**: 1611-1621
**Function**: `processAdjustments` (penalty calculation section)

### Root Cause

The penalty exemption logic only checks if a `late_early_makeup` request exists, but does NOT check if the employee completed their commitment (checkout >= to_time).

**Current Buggy Code**:
```typescript
if (exemptWithRequest && v.hasApprovedRequest) {
  const hasExemptRequest = v.approvedRequestTypes.some((t: string) => exemptRequestTypes.includes(t))
  if (hasExemptRequest) {
    isExempted = true  // BUG: Always exempts if request exists
  }
}
```

## Counterexamples Found

The property-based test generated 20 counterexamples across different scenarios:

### Sample Counterexamples

1. **Employee 00003 on 2026-03-22**: makeup to_time=20:00, checkout=19:00, early=60min
   - Expected: Penalty applied
   - Actual (unfixed): NO penalty (bug)

2. **Employee 00001 on 2026-03-20**: makeup to_time=17:30, checkout=17:02, early=28min
   - Expected: Penalty applied
   - Actual (unfixed): NO penalty (bug)

3. **Employee 00002 on 2026-03-22**: makeup to_time=18:15, checkout=16:28, early=107min
   - Expected: Penalty applied
   - Actual (unfixed): NO penalty (bug)

4. **Employee 00001 on 2026-03-21**: makeup to_time=19:15, checkout=17:15, early=120min
   - Expected: Penalty applied
   - Actual (unfixed): NO penalty (bug)

### Concrete Bug Example from Requirements

**Employee**: Hoàng Phan Tuấn (00002)
**Date**: 2026-03-20
**Makeup request to_time**: 18:00
**Actual checkout**: 17:14
**Early minutes**: 46

- **Expected**: Penalty applied for 46 minutes
- **Actual (unfixed)**: No penalty applied (bug confirmed)
- **Root cause**: Logic only checks if late_early_makeup request exists, not whether employee completed the commitment

### Edge Cases Documented

#### 1. Multiple Makeup Requests Same Day
**Employee**: 00003
**Date**: 2026-03-15
**Makeup requests**: 18:00, 19:00
**Latest to_time**: 19:00
**Actual checkout**: 18:30
**Early minutes**: 30

- **Expected**: Penalty applied for 30 minutes (using latest to_time)
- **Actual (unfixed)**: No penalty applied (bug confirmed)

#### 2. Checkout Equals to_time (Correct Behavior)
**Employee**: 00001
**Date**: 2026-03-10
**to_time**: 18:00
**checkout**: 18:00

- **Expected**: No penalty (completed commitment)
- **This is CORRECT behavior** - should be preserved after fix

#### 3. Below Threshold (Correct Behavior)
**Employee**: 00001
**Date**: 2026-03-11
**to_time**: 18:00
**checkout**: 17:50
**earlyMinutes**: 10 (below 15-minute threshold)

- **Expected**: No penalty (below threshold)
- **This is CORRECT behavior** - should be preserved after fix

## Bug Impact

**Scope**: All employees with `late_early_makeup` requests who checkout before their committed `to_time`

**Severity**: High - Employees are incorrectly exempted from penalties they should receive

**Affected Scenarios**:
- Employees with makeup work commitments who leave early
- Various to_time values (17:00-20:00)
- Various early departure times (16-120 minutes early)
- Multiple makeup requests on the same day

## Expected Behavior (After Fix)

The fix should:

1. **Check completion status**: Before exempting a `late_early_makeup` request, verify that `checkout >= to_time`
2. **Apply penalty when incomplete**: If `checkout < to_time` AND `earlyMinutes > threshold`, apply penalty
3. **Preserve exemption when complete**: If `checkout >= to_time`, continue to exempt (correct behavior)
4. **Preserve other exemptions**: Other request types (`late_arrival`, `early_leave`, etc.) should continue to be exempted

## Next Steps

1. ✅ **Task 1 Complete**: Bug condition exploration test written and run
2. ⏭️ **Task 2**: Write preservation property tests (before implementing fix)
3. ⏭️ **Task 3**: Implement fix
4. ⏭️ **Task 3.4**: Re-run this same test - it should PASS after fix
5. ⏭️ **Task 3.5**: Verify preservation tests still pass

## Test Validation

**Property 1: Bug Condition - Incomplete Makeup Work Penalty**
- ✅ Test written
- ✅ Test run on unfixed code
- ✅ 20 counterexamples generated
- ✅ Bug confirmed through counterexamples
- ✅ Concrete example from requirements validated
- ✅ Edge cases documented

**Status**: Task 1 complete - ready to proceed to Task 2 (preservation tests)
