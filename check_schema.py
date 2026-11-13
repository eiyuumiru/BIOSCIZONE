import libsql

conn = libsql.connect('uniguide_local.db')
rs = conn.execute("PRAGMA table_info(bio_buddies)")
print("bio_buddies columns:")
for row in rs.fetchall():
    print(row)
conn.close()