package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.EditionResults;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EditionResults entity.
 */
@Repository
public interface EditionResultsRepository extends JpaRepository<EditionResults, Long> {
    default Optional<EditionResults> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<EditionResults> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<EditionResults> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select editionResults from EditionResults editionResults left join fetch editionResults.participant where editionResults.participant.user.login = ?#{authentication.name}",
        countQuery = "select count(editionResults) from EditionResults editionResults"
    )
    Page<EditionResults> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select editionResults from EditionResults editionResults left join fetch editionResults.participant where editionResults.participant.user.login = ?#{authentication.name}"
    )
    List<EditionResults> findAllWithToOneRelationships();

    @Query(
        "select editionResults from EditionResults editionResults left join fetch editionResults.participant where editionResults.id =:id and editionResults.participant.user.login = ?#{authentication.name}"
    )
    Optional<EditionResults> findOneWithToOneRelationships(@Param("id") Long id);
}
