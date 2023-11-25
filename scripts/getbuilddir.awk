# Copyright Red Hat
# Prints the build directory for nodejs.spec.
BEGINFILE {
  ORS=""
}
/%global nodejs_major/{
  major = $3
}
/%global nodejs_minor/{
  minor = $3
}
/%global nodejs_patch/{
  patch = $3
}
/%autosetup -p1 -n node-v%{nodejs_version}/{
  sub(/%{nodejs_version}/,major"."minor"."patch,$4)
  directory = $4
}
ENDFILE {
  rec = directory
  print rec
}
