package com.ideasTracker.project.ideas.mapper;

import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.entity.Idea;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;



@Mapper(componentModel = "spring")
public interface IdeaMapper {

    @Mapping(target="id", ignore=true)
    @Mapping(target="status", ignore = true)
    @Mapping(target="createdAt", ignore=true)
    @Mapping(target="updatedAt", ignore=true)
    Idea toEntity(IdeaCreateRequest req);

    @Mapping(target = "createdByName", source = "createdBy.name")
    IdeaResponse toResponse(Idea idea);

}