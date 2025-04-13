package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Participant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Participant entity.
 */
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    default Optional<Participant> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Participant> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Participant> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select participant from Participant participant left join fetch participant.user where participant.user.login = ?#{authentication.name}",
        countQuery = "select count(participant) from Participant participant"
    )
    Page<Participant> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select participant from Participant participant left join fetch participant.user where participant.user.login = ?#{authentication.name}"
    )
    List<Participant> findAllWithToOneRelationships();

    @Query(
        "select participant from Participant participant left join fetch participant.user where participant.id =:id and participant.user.login = ?#{authentication.name}"
    )
    Optional<Participant> findOneWithToOneRelationships(@Param("id") Long id);
}
