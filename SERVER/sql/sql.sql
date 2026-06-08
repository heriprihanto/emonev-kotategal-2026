SELECT json_agg(row_to_json(t))
           FROM (
                  SELECT id,kd_tahap,kd_visi,visi,concat(kd_visi,'- ',visi) as uraian,1 as lvl,'true' as expanded,penjelasan,
                    (
                      SELECT json_agg(row_to_json(s))
                      FROM (
                             SELECT id,kd_tahap,kd_visi,kd_misi,misi,concat(kd_visi,'. ',kd_misi,' ',misi) as uraian,2 as lvl,'true' as expanded,penjelasan,
                             	(
                                  SELECT json_agg(row_to_json(p))
                                  FROM (
                                         SELECT id,kd_tahap,kd_visi,kd_misi,kd_tujuan,tujuan,concat(kd_visi,'. ',kd_misi,'.',kd_tujuan,' ',tujuan) as uraian,3 as lvl,'true' as expanded,penjelasan,
                                         (
                                              SELECT json_agg(row_to_json(k))
                                              FROM (
                                                     SELECT id,id_sub_pd,kode_program,kd_tujuan,kd_sasaran,kd_tahap,kode_kegiatan,nm_kegiatan,concat(kode_kegiatan,'- ',nm_kegiatan) as uraian,4 as lvl,'true' as expanded,
                                                     (
                                                      SELECT json_agg(row_to_json(sk))
                                                      FROM (
                                                             SELECT id,id_sub_pd,kd_tujuan,kd_sasaran,kd_tahap,kode_program,kode_kegiatan,kode_subkegiatan,nm_subkegiatan,concat(kode_subkegiatan,'- ',nm_subkegiatan) as uraian,5 as lvl,'true' as expanded
                                                             FROM renstra_subkegiatan
                                                             WHERE renstra_subkegiatan.kd_tujuan = renstra_kegiatan.kd_tujuan AND renstra_subkegiatan.kd_sasaran = renstra_kegiatan.kd_sasaran AND renstra_subkegiatan.kode_program = renstra_kegiatan.kode_program AND renstra_subkegiatan.kode_kegiatan = renstra_kegiatan.kode_kegiatan  AND renstra_subkegiatan.id_sub_pd=pid_pd AND renstra_subkegiatan.kd_tahap=ptahap  ORDER BY renstra_subkegiatan.kode_subkegiatan
                                                           ) sk
                                                    ) AS children
                                                     	
                                                     FROM renstra_kegiatan
                                                     WHERE renstra_kegiatan.kd_tujuan = renstra_program.kd_tujuan AND renstra_kegiatan.kd_sasaran = renstra_program.kd_sasaran AND renstra_kegiatan.kode_program = renstra_program.kode_program   AND renstra_kegiatan.id_sub_pd=pid_pd AND renstra_kegiatan.kd_tahap=ptahap  ORDER BY renstra_kegiatan.kode_kegiatan
                                                   ) k
                                            ) AS children
                                         	
                                         FROM rpjmd_tujuan
                                         WHERE rpjmd_tujuan.kd_visi = rpjmd_misi.kd_visi AND rpjmd_tujuan.kd_misi = rpjmd_misi.kd_misi AND rpjmd_tujuan.kd_tahap=ptahap  ORDER BY rpjmd_tujuan.kd_tujuan
                                       ) p
                                ) AS children
                             FROM rpjmd_misi
                             WHERE rpjmd_misi.kd_visi = rpjmd_visi.kd_visi AND rpjmd_misi.kd_tahap=ptahap ORDER BY rpjmd_misi.kd_visi,rpjmd_misi.kd_misi
                    	   ) s
                    ) AS children
                  FROM rpjmd_visi WHERE rpjmd_visi.kd_tahap = ptahap ORDER BY rpjmd_visi.kd_visi
                ) t