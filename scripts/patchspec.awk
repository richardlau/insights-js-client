# Copyright Red Hat
# Inserts PATCH_LINE into the file after the last line beginning "Patch".
BEGINFILE {
  ORS=""
}
{
  rec = rec $0 RS
}
ENDFILE {
  if (match(rec,/.*Patch[^\n]+\n/)) {
    rec = substr(rec,1,RSTART+RLENGTH-1) PATCH_LINE"\n" substr(rec,RSTART+RLENGTH)
  }
  print rec
}
