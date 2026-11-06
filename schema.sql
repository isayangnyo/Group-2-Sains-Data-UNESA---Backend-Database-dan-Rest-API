Table pengguna {
  id_pengguna int [pk, increment]
  nama_lengkap varchar(100) [not null]
  nik varchar(16) [unique, not null]
  nomor_telepon varchar(15) [not null]
  rt_rw varchar(10) [not null]
  peran varchar(20) [default: 'warga']
  dibuat_pada timestamp [default: `now()`]
}

Table kategori_sampah {
  id_kategori int [pk, increment]
  nama_kategori varchar(50) [not null]
  harga_per_kg numeric(10,2) [not null]
  deskripsi text
  dibuat_pada timestamp [default: `now()`]
}

Table transaksi_sampah {
  id_transaksi int [pk, increment]
  id_pengguna int [not null, ref: > pengguna.id_pengguna]
  id_kategori int [not null, ref: > kategori_sampah.id_kategori]
  berat_kg numeric(6,2) [not null]
  total_harga numeric(12,2) [not null]
  status varchar(20) [default: 'menunggu']
  dibuat_pada timestamp [default: `now()`]
}
