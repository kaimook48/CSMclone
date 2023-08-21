const platformCodeData = [
  { id: 'WIN', name: 'Windows' },
  { id: 'WEB', name: 'Web' },
  { id: 'MOB', name: 'Mobile' },
  { id: '111', name: 'All' },
];

const moduleCodeData = [
  'AP',
  'AR',
  'BD',
  'EVAL',
  'IC',
  'FA',
  'GL',
  'HR',
  'MA',
  'MRP',
  'OF',
  'PO',
  'PM',
  'RE',
  'QCM',
  'RT',
  'SE',
  'CSM',
  'PPN',
  'FN',
  'MAIL',
  'TOKBUD',
  'All Module',
  'Other',
];

//Detail Status
const statusCodeData = [
  { id: 'W', name: 'Wait' },
  { id: 'I', name: 'In Progress' },
  { id: 'T', name: 'Test' },
  { id: 'R', name: 'Reject' },
  { id: 'N', name: 'Cancel' },
  { id: 'H', name: 'Hold' },
  { id: 'S', name: 'Send Pretest' },
  { id: 'X', name: 'Send To QC' },
  { id: 'B', name: 'Send Back' },
  { id: 'U', name: 'Update Program' },
  { id: 'Y', name: 'Complete' },
];

//Header Status
const statusCode = [
  { id: 'H', name: 'Hold' },
  { id: 'W', name: 'None' },
  { id: 'I', name: 'In Progress' },
  { id: 'N', name: 'Cancel' },
  { id: 'Y', name: 'Complete' },
];

//ไว้หา ปี/เดือน/วัน ที่เหลือ
const diffDaysHours = (mm_object1, mm_object2, periods) => {
  let less, more, diff, obj = {};
  if (mm_object1.isSameOrBefore(mm_object2)) {
    less = mm_object2;
    more = mm_object2;
  }
  else {
    less = mm_object2;
    more = mm_object1;
  }
  $linq(periods).foreach(x => {
    diff = Math.abs(less.diff(more, x));
    less = moment(less).add(diff, x);
    obj[x] = diff;
  });
  return obj
};
